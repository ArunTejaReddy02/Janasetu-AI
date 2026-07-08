import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { AuthRepository } from './auth.repository';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ChangePasswordDto,
} from './auth.schema';
import {
  AuthTokens,
  AuthUser,
  JwtPayload,
  LoginResult,
  RegisterResult,
} from './auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Register ──────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<RegisterResult> {
    // Validate at least email or phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone is required');
    }

    // Check for conflicts
    if (dto.email) {
      const existing = await this.authRepository.findUserByEmail(dto.email);
      if (existing) {
        throw new ConflictException('An account with this email already exists');
      }
    }
    if (dto.phone) {
      const existing = await this.authRepository.findUserByPhone(dto.phone);
      if (existing) {
        throw new ConflictException('An account with this phone already exists');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create user
    const user = await this.authRepository.createUser({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: dto.role || 'CITIZEN',
      preferredLanguage: dto.preferredLanguage || 'ENGLISH',
      wardId: dto.wardId,
    });

    this.logger.log(`New user registered: ${user.email || user.phone} (${user.role})`);

    const tokens = await this.generateTokens(user as AuthUser);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  // ─── Login ─────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<LoginResult> {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone is required');
    }

    // Find user
    const user = dto.email
      ? await this.authRepository.findUserByEmail(dto.email)
      : await this.authRepository.findUserByPhone(dto.phone!);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.authRepository.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user as AuthUser);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  // ─── Refresh ───────────────────────────────────────────────

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    const stored = await this.authRepository.findRefreshToken(dto.refreshToken);

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Verify the JWT itself
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      await this.authRepository.revokeRefreshToken(dto.refreshToken);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    // Rotate: revoke old, issue new
    await this.authRepository.revokeRefreshToken(dto.refreshToken);
    return this.generateTokens(user as AuthUser);
  }

  // ─── Logout ────────────────────────────────────────────────

  async logout(refreshToken: string): Promise<void> {
    await this.authRepository.revokeRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.authRepository.revokeAllUserRefreshTokens(userId);
  }

  // ─── Change Password ───────────────────────────────────────

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.authRepository.findUserById(userId);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);
    await this.authRepository.updateUser(userId, { passwordHash: newHash });
    await this.authRepository.revokeAllUserRefreshTokens(userId);
  }

  // ─── Validate JWT Payload ──────────────────────────────────

  async validateJwtPayload(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or deactivated');
    }
    return this.sanitizeUser(user);
  }

  // ─── Helpers ───────────────────────────────────────────────

  private async generateTokens(user: AuthUser): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // Persist refresh token
    const refreshExpiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      user: { connect: { id: user.id } },
      expiresAt: new Date(Date.now() + refreshExpiresIn),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
      tokenType: 'Bearer',
    };
  }

  private sanitizeUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      wardId: user.wardId,
      constituencyId: user.constituencyId,
    };
  }
}

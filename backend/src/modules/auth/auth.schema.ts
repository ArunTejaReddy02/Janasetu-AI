import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

// ─── Register ─────────────────────────────────────────────────

export class RegisterDto {
  @ApiProperty({ example: 'Arjun Kumar', description: 'Full name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'arjun@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Phone must be in E.164 format' })
  phone?: string;

  @ApiProperty({ example: 'SecurePass@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.CITIZEN })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: 'HINDI' })
  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @ApiPropertyOptional({ example: 'ward-001' })
  @IsString()
  @IsOptional()
  wardId?: string;
}

// ─── Login ────────────────────────────────────────────────────

export class LoginDto {
  @ApiPropertyOptional({ example: 'arjun@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsString()
  password: string;
}

// ─── Refresh Token ────────────────────────────────────────────

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh JWT token' })
  @IsString()
  refreshToken: string;
}

// ─── Change Password ──────────────────────────────────────────

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must meet complexity requirements',
  })
  newPassword: string;
}

// ─── Forgot Password ──────────────────────────────────────────

export class ForgotPasswordDto {
  @ApiProperty({ example: 'arjun@example.com' })
  @IsEmail()
  email: string;
}

// ─── Reset Password ───────────────────────────────────────────

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token received via email' })
  @IsString()
  token: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must meet complexity requirements',
  })
  newPassword: string;
}

// ─── Auth Types ───────────────────────────────────────────────
// Shared TypeScript interfaces for the Auth module

import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;       // userId
  email?: string;
  phone?: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload extends JwtPayload {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  wardId?: string | null;
  constituencyId?: string | null;
}

export interface RegisterResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginResult {
  user: AuthUser;
  tokens: AuthTokens;
}

import { Role } from '@prisma/client';

export interface UserProfile {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferredLanguage: string;
  avatarUrl?: string | null;
  wardId?: string | null;
  constituencyId?: string | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
}

export interface PaginatedUsers {
  data: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserDto {
  name?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
  wardId?: string;
  constituencyId?: string;
}

export interface UpdateUserRoleDto {
  role: Role;
}

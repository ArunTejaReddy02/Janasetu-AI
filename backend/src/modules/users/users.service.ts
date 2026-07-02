import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto, UserProfile, PaginatedUsers } from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string): Promise<UserProfile> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.toProfile(user);
  }

  async findMany(params: {
    page?: number;
    limit?: number;
    role?: string;
    wardId?: string;
    search?: string;
  }): Promise<PaginatedUsers> {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 20, 100);
    const { data, total } = await this.usersRepository.findMany({ page, limit, ...params });
    return {
      data: data.map(this.toProfile),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserProfile> {
    await this.findById(id); // ensure exists
    const updated = await this.usersRepository.update(id, dto);
    return this.toProfile(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.findById(id);
    await this.usersRepository.softDelete(id);
  }

  private toProfile(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      preferredLanguage: user.preferredLanguage,
      avatarUrl: user.avatarUrl,
      wardId: user.wardId,
      constituencyId: user.constituencyId,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}

import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * @Roles(...roles) decorator — restricts a route to specific roles.
 *
 * @example
 * @Roles(Role.ADMIN, Role.SUPER_ADMIN)
 * @Get('admin-only')
 * getAdminData() {}
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

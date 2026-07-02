import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() decorator — marks a route as publicly accessible (no JWT required).
 * Used in conjunction with JwtAuthGuard.
 *
 * @example
 * @Public()
 * @Get('health')
 * health() {}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

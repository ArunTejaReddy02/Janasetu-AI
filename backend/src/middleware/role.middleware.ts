import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

/**
 * Role middleware — lightweight role check for non-NestJS guard contexts.
 * Prefer the @Roles() + RolesGuard pattern inside controllers.
 */
@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly requiredRoles: Role[]) {}

  use(req: Request & { user?: any }, res: Response, next: NextFunction): void {
    if (!req.user) {
      throw new ForbiddenException('Not authenticated');
    }
    if (!this.requiredRoles.includes(req.user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    next();
  }
}

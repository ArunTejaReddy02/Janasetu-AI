import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  role: Role;
  wardId?: string | null;
  constituencyId?: string | null;
}

// Fix TS2717: Override Express.User so req.user has the correct type.
// @types/passport declares req.user as Express.User | undefined,
// so we redefine Express.User to match AuthenticatedUser.
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends AuthenticatedUser {}
  }
}



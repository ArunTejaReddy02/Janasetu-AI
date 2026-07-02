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

// Extend Express Request to include the user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

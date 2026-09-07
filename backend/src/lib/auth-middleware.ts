import { verifyToken, UserSessionPayload } from './jwt';

export function getSessionFromRequest(req: Request): UserSessionPayload | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

export function requireAuth(req: Request): UserSessionPayload {
  const session = getSessionFromRequest(req);
  if (!session) {
    throw new Error('UNAUTHORIZED: You must be logged in to perform this action');
  }
  return session;
}

export function requireRole(req: Request, allowedRole: 'USER' | 'TRAINER'): UserSessionPayload {
  const session = requireAuth(req);
  if (session.role !== allowedRole) {
    throw new Error(`FORBIDDEN: Requires ${allowedRole} role permission`);
  }
  return session;
}

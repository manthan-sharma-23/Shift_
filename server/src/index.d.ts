import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: { userId: string; containerId: string } & JwtPayload;
    }
  }
}

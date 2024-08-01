import { JwtDecodedData } from './engine/types/jwt.types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtDecodedData & { userId: string };
    }
  }
}

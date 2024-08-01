import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../services/Jwt.service';

type token = string;
@Injectable()
export default class AuthenticateJWTToken implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    let token = req.headers.authorization as token;

    if (!token) throw new UnauthorizedException();

    if (token.startsWith('Bearer ')) token = token.split(' ')[1];

    const user = this.jwtService.decode_token(token);

    if (!user.userId) {
      return false;
    }

    req.user = user;
    return true;
  }
}

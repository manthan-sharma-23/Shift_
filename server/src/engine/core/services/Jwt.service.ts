import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { configurations } from 'src/lib/config';

type User = { userId: string };
@Injectable()
export class JwtService {
  sign_token(user: User) {
    const token = jwt.sign(user, configurations.env.JWT_SECRET, {
      expiresIn: '5d',
    });
    return token;
  }

  decode_token(token: string) {
    const user = jwt.decode(token) as User;
    return user;
  }
}

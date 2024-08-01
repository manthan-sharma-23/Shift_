import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  MisdirectedException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { BcryptService } from 'src/engine/core/services/Bcrypt.service';
import { JwtService } from 'src/engine/core/services/Jwt.service';
import DatabaseService from 'src/engine/database/Database.service';
import { UserValidator } from 'src/engine/types/validators/user.validator';

@Injectable()
export default class UserService {
  constructor(
    private database: DatabaseService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async login_user(req: Request) {
    try {
      const input = UserValidator.parse(req.body);

      const user = await this.database.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user || !user.id) {
        throw new NotFoundException('User not found');
      }

      const isPasswordCorrect = await this.bcryptService.compare_password(
        input.password,
        user.password,
      );

      if (isPasswordCorrect) {
        const token = this.jwtService.sign_token({ userId: user.id });

        return { token, message: 'User logged in successfully' };
      } else {
        throw new ForbiddenException('Password input is incorrect');
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async register_user(req: Request) {
    try {
      console.log(req.body);

      const input = UserValidator.parse(req.body);

      let user = await this.database.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (user) {
        throw new MisdirectedException('User already signed up, please login');
      }

      const hash = await this.bcryptService.hash_password(input.password);

      user = await this.database.user.create({
        data: {
          name: input.name,
          password: hash,
          email: input.email,
        },
      });

      const token = this.jwtService.sign_token({ userId: user.id });

      return { token, message: 'User Registered Successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async get_user(req: Request) {
    try {
      const userId = req.user.userId as string;

      if (!userId) {
        throw new ForbiddenException('User not authorized');
      }

      const user = await this.database.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          password: false,
          email: true,
          name: true,
          createdAt: true,
          image: true,
          id: true,
        },
      });

      if (!user) {
        throw new ForbiddenException('User not authorized');
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}

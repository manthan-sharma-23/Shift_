import { Module } from '@nestjs/common';
import UserService from './user.service';
import UserController from './user.controller';
import DatabaseService from 'src/engine/database/Database.service';
import { BcryptService } from 'src/engine/core/services/Bcrypt.service';
import { JwtService } from 'src/engine/core/services/Jwt.service';

@Module({
  providers: [UserService, DatabaseService, BcryptService, JwtService],
  controllers: [UserController],
})
export default class UserModule {}

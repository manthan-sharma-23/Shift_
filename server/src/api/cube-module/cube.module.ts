import { Module } from '@nestjs/common';
import CubeController from './cube.controller';
import CubeService from './cube.service';
import DatabaseService from 'src/engine/database/Database.service';
import AuthenticateJWTToken from 'src/engine/core/guards/Authentication.guard';
import { JwtService } from 'src/engine/core/services/Jwt.service';

@Module({
  providers: [CubeService, DatabaseService, JwtService],
  controllers: [CubeController],
})
export default class CubeModule {}

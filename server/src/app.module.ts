import { Module } from '@nestjs/common';
import UserModule from './api/user-module/user.module';
import CubeModule from './api/cube-module/cube.module';

@Module({
  imports: [UserModule, CubeModule],
})
export class AppModule {}

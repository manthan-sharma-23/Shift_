import { Module } from '@nestjs/common';
import UserModule from './api/user-module/user.module';
import CubeModule from './api/cube-module/cube.module';
import SocketConnectionManagerService from './engine/core/services/socket-connection-manager.service';

@Module({
  imports: [UserModule, CubeModule],
  providers: [SocketConnectionManagerService],
})
export class AppModule {}

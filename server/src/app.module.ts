import { Module } from '@nestjs/common';
import UserModule from './api/user-module/user.module';
import CubeModule from './api/cube-module/cube.module';
import SocketConnectionManagerService from './engine/socket/socket-client/socket-connection-manager.service';
import SocketModule from './engine/socket/socket-server/socket.module';

@Module({
  imports: [UserModule, CubeModule, SocketModule
    
  ],
  providers: [SocketConnectionManagerService],
})
export class AppModule {}

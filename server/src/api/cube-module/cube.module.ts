import { Module } from '@nestjs/common';
import CubeController from './cube.controller';
import CubeService from './cube.service';
import DatabaseService from 'src/engine/database/Database.service';
import { JwtService } from 'src/engine/core/services/Jwt.service';
import { ContainerService } from 'src/engine/core/services/Container.service';
import SocketConnectionManagerService from 'src/engine/socket/socket-client/socket-connection-manager.service';

@Module({
  providers: [
    CubeService,
    DatabaseService,
    JwtService,
    ContainerService,
    SocketConnectionManagerService,
  ],
  controllers: [CubeController],
})
export default class CubeModule {}


import { Module } from '@nestjs/common';
import CubeController from './cube.controller';
import CubeService from './cube.service';
import DatabaseService from 'src/engine/database/Database.service';
import { JwtService } from 'src/engine/core/services/Jwt.service';
import { ContainerService } from 'src/engine/core/services/Container.service';
import SocketConnectionManagerService from 'src/engine/core/services/socket-connection-manager.service';
import S3Service from 'src/engine/core/services/aws_s3.service';

@Module({
  providers: [
    CubeService,
    DatabaseService,
    JwtService,
    ContainerService,
    SocketConnectionManagerService,
    S3Service,
  ],
  controllers: [CubeController],
})
export default class CubeModule {}

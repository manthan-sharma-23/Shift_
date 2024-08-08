import { Module } from '@nestjs/common';
import SocketGateway from './socket.gateway';
import SocketConnectionManagerService from '../socket-client/socket-connection-manager.service';

@Module({
  imports: [SocketGateway],
  providers: [SocketConnectionManagerService],
})
export default class SocketModule {}

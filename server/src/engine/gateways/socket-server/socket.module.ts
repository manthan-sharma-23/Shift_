import { Module } from '@nestjs/common';
import SocketGateway from './socket.gateway';

@Module({
  imports: [SocketGateway],
})
export default class SocketModule {}

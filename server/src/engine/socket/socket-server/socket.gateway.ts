import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export default class SocketGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('New client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('New client connected', client.id);
  }

  @SubscribeMessage('list:filesystem')
  get_file_system(_client: Socket, _message: any) {
    return 'Received get dir request';
  }
}

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import SocketToContainerService from '../socket-client/socket-client.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export default class SocketGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;
  private client_socket: SocketToContainerService;

  constructor() {
    this.client_socket?.socket?.on('terminal:written', (data) => {
      console.log(data);

      this.server.emit('terminal:written', data);
    });
  }

  handleConnection(client: Socket) {
    console.log('New client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('New client connected', client.id);
  }

  @SubscribeMessage('terminal:write')
  async write_to_terminal(_: Socket, cmd: string) {
    this.client_socket.socket.emit('terminal:write', cmd);
  }

  @SubscribeMessage('list:filesystem')
  async get_file_system() {
    this.client_socket = new SocketToContainerService(3300);
    const dir = await this.client_socket.get_file_system_from_container();
    return dir;
  }

  @SubscribeMessage('get:file:path')
  async get_file_path(_: Socket, path: string) {
    console.log('To get file path', path);

    const content = await this.client_socket.get_file_content(path);
    return content;
  }
}

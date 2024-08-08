import { Cube } from '@prisma/client';
import { io, Socket } from 'socket.io-client';

export default class SocketToContainerService {
  public socket: Socket;
  cube: Cube;

  constructor(port: number, cube: Cube) {
    console.log('creating socket connection with ', cube.id);
    try {
      this.socket = io(`http://localhost:${port}`);
      this.cube = cube;
    } catch (error) {
      console.log(error);
    }
  }

  get_file_system_from_container() {
    this.socket.emit('get:filesystem');
  }
}

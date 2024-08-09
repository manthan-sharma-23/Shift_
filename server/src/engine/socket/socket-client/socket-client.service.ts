import { Cube } from '@prisma/client';
import { io, Socket } from 'socket.io-client';

export default class SocketToContainerService {
  public socket: Socket;
  cube: Cube;

  constructor(port: number, cube?: Cube) {
    try {
      this.socket = io(`http://localhost:${port}`);
      this.cube = cube;
    } catch (error) {
      console.log(error);
    }
  }

  async get_file_system_from_container() {
    const dirStruct = (await this.sendRequest('get:filesystem')) as any;
    return dirStruct;
  }

  async get_file_content(path: string) {
    const content = await this.sendRequest('get:file', path);
    return content;
  }

  private sendRequest(type: string, data: any = null) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        alert('No socket state active');
        return;
      }
      this.socket.emit(type, data, (response: any, err: any) => {
        if (!err) {
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  }
}

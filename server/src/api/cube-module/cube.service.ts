import { Injectable, InternalServerErrorException } from '@nestjs/common';
import DatabaseService from 'src/engine/database/Database.service';
import { Request } from 'express';
import { ProjectCreationInput } from 'src/engine/types/validators/projects.validator';
import { ContainerService } from 'src/engine/core/services/Container.service';
import SocketConnectionManagerService from 'src/engine/socket/socket-client/socket-connection-manager.service';

@Injectable()
export default class CubeService {
  constructor(
    private databaseService: DatabaseService,
    private containerService: ContainerService,
    private readonly socketConnectionManagerService: SocketConnectionManagerService,
  ) {}

  async create_cube(req: Request) {
    try {
      const { userId } = req.user;
      const query = ProjectCreationInput.parse(req.body);

      const cube_modal = await this.databaseService.cube.create({
        data: {
          name: query.name,
          type: query.type,
          userId,
        },
      });

      const { port1, port2 } =
        await this.containerService.run_containers(cube_modal);

      const res = await this.delay(10 * 1000, cube_modal);

      this.socketConnectionManagerService.create_socket_connection({
        express_port: port1,
        other_port: port2,
        cube: cube_modal,
      });

      
      return res;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async get_user_cubes(req: Request) {
    const { userId } = req.user;

    const cubes = await this.databaseService.cube.findMany({
      where: {
        userId,
      },
    });

    return cubes;
  }

  delay<T>(ms: number, result: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(result), ms));
  }
}

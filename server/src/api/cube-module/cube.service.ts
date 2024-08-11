import { Injectable, InternalServerErrorException } from '@nestjs/common';
import DatabaseService from 'src/engine/database/Database.service';
import { Request } from 'express';
import {
  ProjectCreationInput,
  RunCubeInput,
} from 'src/engine/types/validators/projects.validator';
import { ContainerService } from 'src/engine/core/services/Container.service';
import SocketConnectionManagerService from 'src/engine/core/services/socket-connection-manager.service';
import S3Service from 'src/engine/core/services/aws_s3.service';

@Injectable()
export default class CubeService {
  constructor(
    private databaseService: DatabaseService,
    private containerService: ContainerService,
    private readonly socketConnectionManagerService: SocketConnectionManagerService,
    private s3Service: S3Service,
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

      await this.containerService.create_container(cube_modal);

      return cube_modal;
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

  async run_cube(req: Request) {
    const { cubeId } = RunCubeInput.parse(req.body);
    const cube = await this.databaseService.cube.findUniqueOrThrow({
      where: {
        id: cubeId,
      },
    });

    const { ports } = await this.containerService.run_container(cube);

    return { ports };
  }

  async burn_containers(cubeId: string, req: Request) {
    console.log(this.socketConnectionManagerService.express_available_ports);
    console.log(this.socketConnectionManagerService.express_cubeId_map);

    const r = await this.containerService.burnContainers(
      cubeId,
      req.user.userId,
    );

    return r;
  }

  delay<T>(ms: number, result: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(result), ms));
  }
}

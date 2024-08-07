import { Injectable, InternalServerErrorException } from '@nestjs/common';
import DatabaseService from 'src/engine/database/Database.service';
import { Request } from 'express';
import { ProjectCreationInput } from 'src/engine/types/validators/projects.validator';
import { ContainerService } from 'src/engine/core/services/Container.service';

@Injectable()
export default class CubeService {
  constructor(
    private databaseService: DatabaseService,
    private containerService: ContainerService,
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

      await this.containerService.run_containers(cube_modal);

      const res = await this.delay(10 * 1000, cube_modal);
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

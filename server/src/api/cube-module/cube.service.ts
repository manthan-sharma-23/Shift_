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
      const { containerId } = req.user;
      const query = ProjectCreationInput.parse(req.body);

      if (query.name && query.type) {
        await this.containerService.create_project(containerId, {
          name: query.name,
          type: query.type,
        });
      }

      return { query, user: req.user };

      // const cube = await this.databaseService.cube.create({
      //   data: {
      //     name: query.name,
      //     type: query.type,
      //     userId,
      //   },
      // });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}

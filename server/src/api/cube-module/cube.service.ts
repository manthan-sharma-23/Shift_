import { Injectable } from '@nestjs/common';
import DatabaseService from 'src/engine/database/Database.service';
import { Request } from 'express';
import { ProjectCreationInput } from 'src/engine/types/validators/projects.validator';

@Injectable()
export default class CubeService {
  constructor(private databaseService: DatabaseService) {}

  async create_cube(req: Request) {
    const { userId, containerId } = req.user;
    const query = ProjectCreationInput.parse(req.body);


    return {query,user:req.user}

    // const cube = await this.databaseService.cube.create({
    //   data: {
    //     name: query.name,
    //     type: query.type,
    //     userId,
    //   },
    // });
  }
}

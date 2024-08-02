import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import CubeService from './cube.service';
import { Request } from 'express';
import AuthenticateJWTToken from 'src/engine/core/guards/Authentication.guard';

@Controller('/v1/cube')
export default class CubeController {
  constructor(private cubeService: CubeService) {}

  @Post('/create-cube')
  @UseGuards(AuthenticateJWTToken)
  async create_cube(@Req() req: Request) {
    return await this.cubeService.create_cube(req);
  }
}

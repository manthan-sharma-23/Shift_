import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
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

  @Get('/')
  @UseGuards(AuthenticateJWTToken)
  async get_user_cubes(@Req() req: Request) {
    return await this.cubeService.get_user_cubes(req);
  }

  @Put('/run-cube')
  @UseGuards(AuthenticateJWTToken)
  async run_container(@Req() req: Request) {
    return await this.cubeService.run_cube(req);
  }
}

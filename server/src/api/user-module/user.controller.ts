import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import UserService from './user.service';
import { Request } from 'express';
import AuthenticateJWTToken from 'src/engine/core/guards/Authentication.guard';

@Controller('/v1/user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async login_user(@Req() req: Request) {
    return await this.userService.login_user(req);
  }

  @Post('/register')
  async register_user(@Req() req: Request) {
    return await this.userService.register_user(req);
  }

  @Get('/')
  @UseGuards(AuthenticateJWTToken)
  async get_uer(@Req() req: Request) {
    return await this.userService.get_user(req);
  }
}

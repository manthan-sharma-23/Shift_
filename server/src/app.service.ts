import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public async createUserContainer(req: Request): Promise<string> {
    const containerId = req.body.containerId as string;

    return `New Container spinned up with id ${containerId}`;
  }
}

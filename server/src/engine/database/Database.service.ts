import { Injectable, OnModuleInit } from '@nestjs/common';
import * as prisma from '@prisma/client';

@Injectable()
export default class DatabaseService
  extends prisma.PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}

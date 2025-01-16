import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClientExtended } from './prisma.client';

@Injectable()
export class PrismaService
  extends PrismaClientExtended
  implements OnModuleInit
{
  constructor() {
    super({
      log: process.env.DEBUG == 'true' ? ['query'] : undefined,
      errorFormat: 'pretty',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

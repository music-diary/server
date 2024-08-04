import { Injectable } from '@nestjs/common';
import { Prisma, Topics } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';

@Injectable()
export class TopicsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.TopicsFindManyArgs): Promise<Topics[]> {
    return await this.prismaService.topics.findMany(query);
  }
}

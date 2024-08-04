import { Injectable } from '@nestjs/common';
import { Emotions, Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';

@Injectable()
export class EmotionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.EmotionsFindManyArgs): Promise<Emotions[]> {
    return await this.prismaService.emotions.findMany(query);
  }

  async findUnique(query?: Prisma.EmotionsFindUniqueArgs): Promise<Emotions> {
    return await this.prismaService.emotions.findUnique(query);
  }

  async findOne(query?: Prisma.EmotionsFindFirstArgs): Promise<Emotions> {
    return await this.prismaService.emotions.findFirst(query);
  }
}

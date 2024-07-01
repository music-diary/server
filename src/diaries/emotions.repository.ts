import { Injectable } from '@nestjs/common';
import { Emotions, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EmotionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.EmotionsFindManyArgs): Promise<Emotions[]> {
    return await this.prismaService.emotions.findMany(query);
  }
}

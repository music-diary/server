import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DiaryEmotions, Prisma } from '@prisma/client';
@Injectable()
export class DiaryEmotionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    query?: Prisma.DiaryEmotionsFindManyArgs,
  ): Promise<DiaryEmotions[]> {
    return await this.prismaService.diaryEmotions.findMany(query);
  }

  async findOne(
    query?: Prisma.DiaryEmotionsFindFirstArgs,
  ): Promise<DiaryEmotions | null> {
    return await this.prismaService.diaryEmotions.findFirst(query);
  }

  async findUniqueOne(
    query: Prisma.DiaryEmotionsFindUniqueArgs,
  ): Promise<DiaryEmotions | null> {
    return await this.prismaService.diaryEmotions.findUnique(query);
  }

  async create(query: Prisma.DiaryEmotionsCreateArgs): Promise<DiaryEmotions> {
    return await this.prismaService.client.diaryEmotions.createAtKoreaTime(
      query,
    );
  }

  async createMany(
    query?: Prisma.DiaryEmotionsCreateManyArgs,
  ): Promise<{ count: number }> {
    return await this.prismaService.client.diaryEmotions.createManyAtKoreaTime(
      query,
    );
  }

  async update(query: Prisma.DiaryEmotionsUpdateArgs): Promise<DiaryEmotions> {
    return await this.prismaService.client.diaryEmotions.updateAtKoreaTime(
      query,
    );
  }

  async delete(query: Prisma.DiaryEmotionsDeleteArgs): Promise<DiaryEmotions> {
    return await this.prismaService.diaryEmotions.delete(query);
  }

  async deleteMany(
    query?: Prisma.DiaryEmotionsDeleteManyArgs,
  ): Promise<{ count: number }> {
    return await this.prismaService.diaryEmotions.deleteMany(query);
  }
}

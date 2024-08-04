import { Injectable } from '@nestjs/common';
import { DiaryTopics, Prisma } from '@prisma/client';
import { PrismaService } from '@common/database/prisma.service';

@Injectable()
export class DiaryTopicsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    query?: Prisma.DiaryTopicsFindManyArgs,
  ): Promise<DiaryTopics[]> {
    return await this.prismaService.diaryTopics.findMany(query);
  }

  async findOne(query?: Prisma.DiaryTopicsFindFirstArgs): Promise<DiaryTopics> {
    return await this.prismaService.diaryTopics.findFirst(query);
  }

  async findUniqueOne(
    query?: Prisma.DiaryTopicsFindUniqueArgs,
  ): Promise<DiaryTopics> {
    return await this.prismaService.diaryTopics.findUnique(query);
  }

  async create(query?: Prisma.DiaryTopicsCreateArgs): Promise<DiaryTopics> {
    return await this.prismaService.diaryTopics.create(query);
  }

  async createMany(
    query?: Prisma.DiaryTopicsCreateManyArgs,
  ): Promise<{ count: number }> {
    return await this.prismaService.diaryTopics.createMany(query);
  }

  async update(query?: Prisma.DiaryTopicsUpdateArgs): Promise<DiaryTopics> {
    return await this.prismaService.diaryTopics.update(query);
  }

  async delete(query?: Prisma.DiaryTopicsDeleteArgs): Promise<DiaryTopics> {
    return await this.prismaService.diaryTopics.delete(query);
  }

  async deleteMany(
    query?: Prisma.DiaryTopicsDeleteManyArgs,
  ): Promise<{ count: number }> {
    return await this.prismaService.diaryTopics.deleteMany(query);
  }
}

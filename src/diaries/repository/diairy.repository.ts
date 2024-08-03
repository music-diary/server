import { Injectable } from '@nestjs/common';
import { Diaries, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.DiariesFindManyArgs): Promise<Diaries[]> {
    return await this.prismaService.diaries.findMany(query);
  }

  async findOne(query?: Prisma.DiariesFindFirstArgs): Promise<Diaries> {
    return await this.prismaService.diaries.findFirst(query);
  }

  async findUniqueOne(query?: Prisma.DiariesFindUniqueArgs): Promise<Diaries> {
    return await this.prismaService.diaries.findUnique(query);
  }

  async create(query?: Prisma.DiariesCreateArgs): Promise<Diaries> {
    return await this.prismaService.diaries.create(query);
  }

  async update(query?: Prisma.DiariesUpdateArgs): Promise<Diaries> {
    return await this.prismaService.diaries.update(query);
  }

  async delete(query?: Prisma.DiariesDeleteArgs): Promise<Diaries> {
    return await this.prismaService.diaries.delete(query);
  }
}

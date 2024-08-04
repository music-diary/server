import { Injectable } from '@nestjs/common';
import { Diaries, Prisma } from '@prisma/client';
import { PrismaService } from '@common/database/prisma.service';

@Injectable()
export class DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.DiariesFindManyArgs): Promise<Diaries[]> {
    return await this.prismaService.client.diaries.findManyAvailable(query);
  }

  async findOne(query?: Prisma.DiariesFindFirstArgs): Promise<Diaries> {
    return await this.prismaService.client.diaries.findOneAvailable(query);
  }

  async findUniqueOne(query?: Prisma.DiariesFindUniqueArgs): Promise<Diaries> {
    return await this.prismaService.client.diaries.findUniqueAvailable(query);
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

  async softDelete(query?: Prisma.DiariesWhereUniqueInput): Promise<Diaries> {
    return await this.prismaService.client.diaries.softDelete(query);
  }
}

import { Injectable } from '@nestjs/common';
import { Musics, Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { GetBatchResult } from '@prisma/client/runtime/library';

@Injectable()
export class MusicRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(query?: Prisma.MusicsFindManyArgs): Promise<Musics[]> {
    return await this.prismaService.client.musics.findManyAvailable(query);
  }

  async findOne(query: Prisma.MusicsFindFirstArgs): Promise<Musics> {
    return await this.prismaService.client.musics.findOneAvailable(query);
  }

  async findUniqueOne(query: Prisma.MusicsFindUniqueArgs): Promise<Musics> {
    return await this.prismaService.client.musics.findUniqueAvailable(query);
  }

  async create(query?: Prisma.MusicsCreateArgs): Promise<Musics> {
    return await this.prismaService.client.musics.createAtKoreaTime(query);
  }

  async createMany(
    query?: Prisma.MusicsCreateManyArgs,
  ): Promise<{ count: number }> {
    return await this.prismaService.client.musics.createManyAtKoreaTime(query);
  }

  async update(query?: Prisma.MusicsUpdateArgs): Promise<Musics> {
    return await this.prismaService.client.musics.updateAtKoreaTime(query);
  }

  async updateMany(
    query?: Prisma.MusicsUpdateManyArgs,
  ): Promise<GetBatchResult> {
    return await this.prismaService.client.musics.updatedManyAtKoreaTime(query);
  }

  async delete(query?: Prisma.MusicsDeleteArgs): Promise<Musics> {
    return await this.prismaService.musics.delete(query);
  }

  async deleteMany(
    query?: Prisma.MusicsDeleteManyArgs,
  ): Promise<{ count: number }> {
    return await this.prismaService.musics.deleteMany(query);
  }

  async softDelete(query?: Prisma.MusicsWhereUniqueInput): Promise<Musics> {
    return await this.prismaService.client.musics.softDelete(query);
  }
}

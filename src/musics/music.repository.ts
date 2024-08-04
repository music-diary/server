import { Injectable } from '@nestjs/common';
import { Musics, Prisma } from '@prisma/client';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class MusicRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(query?: Prisma.MusicsFindManyArgs): Promise<Musics[]> {
    return await this.prismaService.musics.findMany(query);
  }

  async findOne(query: Prisma.MusicsFindFirstArgs): Promise<Musics> {
    return await this.prismaService.musics.findFirst(query);
  }

  async findUniqueOne(query: Prisma.MusicsFindUniqueArgs): Promise<Musics> {
    return await this.prismaService.musics.findUnique(query);
  }

  async create(query?: Prisma.MusicsCreateArgs): Promise<Musics> {
    return await this.prismaService.musics.create(query);
  }

  async createMany(
    query?: Prisma.MusicsCreateManyArgs,
  ): Promise<{ count: number }> {
    return await this.prismaService.musics.createMany(query);
  }

  async update(query?: Prisma.MusicsUpdateArgs): Promise<Musics> {
    return await this.prismaService.musics.update(query);
  }

  async delete(query?: Prisma.MusicsDeleteArgs): Promise<Musics> {
    return await this.prismaService.musics.delete(query);
  }
}

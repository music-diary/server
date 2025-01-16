import { PrismaService } from '@database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Genres, Prisma } from '@prisma/client';

@Injectable()
export class GenreRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.GenresFindManyArgs): Promise<Genres[]> {
    return await this.prismaService.genres.findMany(query);
  }

  async findOne(query: Prisma.GenresFindFirstArgs): Promise<Genres> {
    return await this.prismaService.genres.findFirst(query);
  }

  async findUniqueOne(query: Prisma.GenresFindUniqueArgs): Promise<Genres> {
    return await this.prismaService.genres.findUnique(query);
  }
}

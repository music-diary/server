import { Injectable } from '@nestjs/common';
import { Genres, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GenresRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.GenresFindManyArgs): Promise<Genres[]> {
    return await this.prismaService.genres.findMany(query);
  }

  async findOne(query: Prisma.GenresFindFirstArgs): Promise<Genres> {
    return await this.prismaService.genres.findFirst(query);
  }
}

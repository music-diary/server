import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, UserGenres } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserGenresRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    query: Prisma.UserGenresCreateArgs,
    tx?: Partial<PrismaClient>,
  ): Promise<UserGenres> {
    return await (tx || this.prismaService).userGenres.create(query);
  }
}

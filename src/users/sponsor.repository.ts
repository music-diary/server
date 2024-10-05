import { Injectable } from '@nestjs/common';
import { Prisma, Sponsors } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';

@Injectable()
export class SponsorRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(query: Prisma.SponsorsCreateArgs): Promise<Sponsors> {
    return await this.prismaService.sponsors.create(query);
  }

  async findMany(query?: Prisma.SponsorsFindManyArgs): Promise<Sponsors[]> {
    return await this.prismaService.sponsors.findMany(query);
  }

  async findOne(query: Prisma.SponsorsFindFirstArgs): Promise<Sponsors> {
    return await this.prismaService.sponsors.findFirst(query);
  }

  async findUnique(query: Prisma.SponsorsFindUniqueArgs): Promise<Sponsors> {
    return await this.prismaService.sponsors.findUnique(query);
  }

  async delete(query: Prisma.SponsorsDeleteArgs): Promise<Sponsors> {
    return await this.prismaService.sponsors.delete(query);
  }

  async update(query: Prisma.SponsorsUpdateArgs): Promise<Sponsors> {
    return await this.prismaService.sponsors.update(query);
  }
}

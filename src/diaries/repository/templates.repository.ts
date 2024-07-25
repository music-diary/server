import { Injectable } from '@nestjs/common';
import { Prisma, Templates } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TemplatesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.TemplatesFindManyArgs): Promise<Templates[]> {
    return await this.prismaService.templates.findMany(query);
  }

  async create(query: Prisma.TemplatesCreateArgs): Promise<Templates> {
    return await this.prismaService.templates.create(query);
  }

  async update(query: Prisma.TemplatesUpdateArgs): Promise<Templates> {
    return await this.prismaService.templates.update(query);
  }
}

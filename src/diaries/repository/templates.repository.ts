import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TemplatesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.TemplatesFindManyArgs): Promise<any[]> {
    return await this.prismaService.templates.findMany(query);
  }
}

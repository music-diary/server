import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { TemplatesDto } from '@diary/dto/templates.dto';

@Injectable()
export class TemplatesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query?: Prisma.TemplatesFindManyArgs): Promise<TemplatesDto[]> {
    return await this.prismaService.templates.findMany(query);
  }

  async create(query: Prisma.TemplatesCreateArgs): Promise<TemplatesDto> {
    return await this.prismaService.templates.create(query);
  }

  async update(query: Prisma.TemplatesUpdateArgs): Promise<TemplatesDto> {
    return await this.prismaService.templates.update(query);
  }
}

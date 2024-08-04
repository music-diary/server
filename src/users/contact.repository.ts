import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { ContactHistoryDto, ContactTypesDto } from './dto/contact.dto';

@Injectable()
export class ContactRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findContactTypes(
    query?: Prisma.ContactTypesFindManyArgs,
  ): Promise<ContactTypesDto[]> {
    return await this.prismaService.contactTypes.findMany(query);
  }

  async findContactTypeById(
    query?: Prisma.ContactTypesFindUniqueArgs,
  ): Promise<ContactTypesDto> {
    return await this.prismaService.contactTypes.findUnique(query);
  }

  async createContactHistories(
    query?: Prisma.ContactHistoryCreateArgs,
  ): Promise<ContactHistoryDto> {
    return await this.prismaService.contactHistory.create(query);
  }
}

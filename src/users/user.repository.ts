import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(query: Prisma.UsersCreateArgs): Promise<Users> {
    return await this.prismaService.client.users.createAtKoreaTime(query);
  }

  async findAll(query?: Prisma.UsersFindManyArgs): Promise<Users[]> {
    return await this.prismaService.users.findMany(query);
  }

  async findOne(query: Prisma.UsersFindFirstArgs): Promise<Users> {
    return await this.prismaService.users.findFirst(query);
  }

  async findUniqueOne(query: Prisma.UsersFindUniqueArgs): Promise<Users> {
    return await this.prismaService.users.findUnique(query);
  }

  async delete(query: Prisma.UsersDeleteArgs): Promise<Users> {
    return await this.prismaService.users.delete(query);
  }

  async update(query: Prisma.UsersUpdateArgs): Promise<Users> {
    return await this.prismaService.client.users.updateAtKoreaTime(query);
  }
}

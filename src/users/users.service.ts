import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Genres, Prisma, Users } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { PrismaService } from '../database/prisma.service';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(userData: Users, genresData: Genres[]): Promise<Users> {
    const createUserQuery: Prisma.UsersCreateArgs = { data: userData };
    const result = await this.prismaService.$transaction(async (tx) => {
      const newUser: Users = await tx.users.create(createUserQuery);
      for (const genre of genresData) {
        const createUserGenresQuery: Prisma.UserGenresCreateArgs = {
          data: {
            userId: newUser.id,
            genreId: genre.id,
          },
        };
        await tx.userGenres.create(createUserGenresQuery);
      }
      this.logService.verbose(
        `New user created - ${newUser.id} ${newUser.name}`,
        UsersService.name,
      );
      return newUser;
    });
    return result;
  }

  async findOne(
    query: Prisma.UsersFindFirstArgs,
  ): Promise<FindUserResponseDto> {
    const { where, ...restQuery } = query;
    const user: Users = await this.prismaService.users.findFirst({
      where,
    });
    this.logService.verbose(
      `Find user by id - ${user.id} ${user.name}`,
      UsersService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'User find by id',
      data: user,
    };
  }

  async getSelf(userId: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindFirstArgs = {
      where: {
        id: userId,
      },
    };
    this.logService.verbose(`Get self user - ${userId}`, UsersService.name);
    return await this.findOne(query);
  }

  async delete(id: string): Promise<CommonDto> {
    const existedUser: Users = await this.prismaService.users.findFirst({
      where: { id },
    });
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    const query: Prisma.UsersDeleteArgs = {
      where: {
        id,
      },
    };
    await this.prismaService.users.delete(query);
    this.logService.verbose(`Delete user by id - ${id}`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted',
    };
  }

  async getAll(): Promise<FindAllUsersResponseDto> {
    this.logService.verbose(`Get all users`, UsersService.name);
    const users = await this.prismaService.users.findMany();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users find all',
      data: users,
    };
  }

  async getUser(id: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindFirstArgs = {
      where: {
        id,
      },
    };
    this.logService.verbose(`Get user by ${id}`, UsersService.name);
    return await this.findOne(query);
  }

  private checkPermission(user: Partial<Users>, userId: string): boolean {
    return user.id === userId;
  }
}

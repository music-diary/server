import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Genres, Prisma, Users } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { PrismaService } from '../database/prisma.service';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UserGenresRepository } from './user-genres.repository';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly prismaService: PrismaService,
    private readonly usersRepository: UsersRepository,
    private readonly userGenresRepository: UserGenresRepository,
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
        await this.userGenresRepository.create(createUserGenresQuery, tx);
      }
      this.logService.verbose(
        `New user created - ${newUser.id} ${newUser.name}`,
        UsersService.name,
      );
      return newUser;
    });
    return result;
  }

  async findOne(id: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindFirstArgs = {
      where: {
        id,
      },
    };
    const user = await this.usersRepository.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logService.verbose(
      `Find user by id - ${user.id} ${user.name}`,
      UsersService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'User find by id',
      user,
    };
  }

  async getSelf(userId: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindFirstArgs = {
      where: {
        id: userId,
      },
    };
    const user = await this.usersRepository.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logService.verbose(`Get self user - ${userId}`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get self user',
      user,
    };
  }

  async delete(id: string): Promise<CommonDto> {
    const query = { where: { id } };
    const existedUser: Users = await this.usersRepository.findOne(query);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(query);
    this.logService.verbose(`Delete user by id - ${id}`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted',
    };
  }

  async update(
    id: string,
    targetId: string,
    body: UpdateUserBodyDto,
  ): Promise<CommonDto> {
    this.checkPermission(id, targetId);
    const { birthDay, ...data } = body;
    const birthDayDate = new Date(birthDay);
    const findUserQuery = { where: { id } };
    const user = await this.usersRepository.findOne(findUserQuery);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.update({
      ...findUserQuery,
      data: { birthDay: birthDayDate, ...data },
    });
    this.logService.verbose(`Update user - ${id}`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated',
    };
  }

  async findAll(): Promise<FindAllUsersResponseDto> {
    this.logService.verbose(`Get all users`, UsersService.name);
    const users = await this.usersRepository.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users find all',
      users,
    };
  }

  private checkPermission(userId: string, targetId: string): boolean {
    return userId === targetId;
  }
}

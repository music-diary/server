import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { PrismaService } from '../database/prisma.service';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly prismaService: PrismaService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findOne(id: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindUniqueArgs = {
      where: {
        id,
      },
    };
    const user = await this.usersRepository.findUniqueOne(query);
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

  async getMe(userId: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindUniqueArgs = {
      where: { id: userId },
      include: {
        genres: {
          select: {
            genre: true,
          },
        },
      },
    };
    const user = await this.usersRepository.findUniqueOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logService.verbose(`Get current user - ${userId}`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get current user',
      user,
    };
  }

  async delete(id: string): Promise<CommonDto> {
    const query = { where: { id } };
    const existedUser: Users = await this.usersRepository.findUniqueOne(query);
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
    await this.prismaService.$transaction(async (tx) => {
      const existUser = await tx.users.findUnique({ where: { id: targetId } });
      if (!existUser) {
        throw new NotFoundException('User not found');
      }
      if ('birthDay' in body && typeof body.birthDay === 'string') {
        const birthDayDate = new Date(body.birthDay);
        body.birthDay = birthDayDate;
      }
      if ('diaryAlarmTime' in body && typeof body.diaryAlarmTime === 'string') {
        const alarmTime = new Date(body.diaryAlarmTime);
        body.diaryAlarmTime = alarmTime;
      }
      if ('genres' in body && typeof body.genres !== undefined) {
        const existedUserGenres = await tx.userGenres.findMany({
          where: { userId: id },
        });
        if (existedUserGenres) {
          const deleteUserGenreQuery: Prisma.UserGenresDeleteManyArgs = {
            where: {
              userId: targetId,
              genreId: {
                in: existedUserGenres.map((genre) => genre.genreId),
              },
            },
          };
          await tx.userGenres.deleteMany(deleteUserGenreQuery);
        }

        const createUserGenreQuery: Prisma.UserGenresCreateManyArgs = {
          data: body.genres.map((genre) => ({
            id: randomUUID(),
            genreId: genre.id,
            userId: targetId,
          })),
        };
        await tx.userGenres.createMany(createUserGenreQuery);
      }
      const { genres: _genres, ...restBody } = body;
      await tx.users.update({ where: { id: targetId }, data: { ...restBody } });
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
    if (userId !== targetId) {
      throw new ForbiddenException('Forbidden resource');
    }
    return;
  }
}

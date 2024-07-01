import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { PrismaService } from '../database/prisma.service';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly prismaService: PrismaService,
    private readonly usersRepository: UsersRepository,
  ) {}

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

  async getMe(userId: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindFirstArgs = {
      where: {
        id: userId,
      },
      include: {
        genres: {
          select: {
            genres: true,
          },
        },
      },
    };
    const user = await this.usersRepository.findOne(query);
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
    await this.prismaService.$transaction(async (tx) => {
      const existUser = await tx.users.findFirst({ where: { id: targetId } });
      if (!existUser) {
        throw new NotFoundException('User not found');
      }
      if ('birthDay' in body && typeof body.birthDay === 'string') {
        const birthDayDate = new Date(body.birthDay);
        body.birthDay = birthDayDate;
      }
      if ('genres' in body && typeof body.genres === 'object') {
        const { genres, ...restUserData } = body;
        const updateUserQuery: Prisma.UsersUpdateArgs = {
          where: { id: targetId },
          data: {
            ...restUserData,
          },
        };
        await tx.users.update(updateUserQuery);

        const deleteUserGenreQuery: Prisma.UserGenresDeleteManyArgs = {
          where: {
            userId: targetId,
          },
        };
        const createUserGenreQuery: Prisma.UserGenresCreateManyArgs = {
          data: genres.map((genre) => ({
            id: `${targetId}-${genre.id}`,
            genreId: genre.id,
            userId: targetId,
          })),
        };

        const [userGenresDeletedResult, userGenresCreatedResult] =
          await Promise.allSettled([
            await tx.userGenres.deleteMany(deleteUserGenreQuery),
            await tx.userGenres.createMany(createUserGenreQuery),
          ]);
        if (
          userGenresDeletedResult.status === 'rejected' ||
          userGenresCreatedResult.status === 'rejected'
        ) {
          throw new InternalServerErrorException(
            'Failed to update user genres',
          );
        }
      }
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

import { HttpStatus, Injectable } from '@nestjs/common';
import { Genres, Prisma, Users } from '@prisma/client';
import { LogService } from 'src/common/log.service';
import { PrismaService } from '../database/prisma.service';
import { FindUserResponseDto } from './dto/find.dto';

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
}

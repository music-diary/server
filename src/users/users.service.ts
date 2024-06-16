import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { LogService } from 'src/common/log.service';
import { PrismaService } from '../database/prisma.service';
import { FindUserResponseDto } from './dto/find.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(data: Users): Promise<Users> {
    const query: Prisma.UsersCreateArgs = { data };
    const newUser: Users = await this.prismaService.users.create(query);
    this.logService.verbose(
      `New user created - ${newUser.id} ${newUser.name}`,
      UsersService.name,
    );
    return newUser;
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

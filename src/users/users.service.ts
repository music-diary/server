import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Users, UserStatus } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';
import { GenresRepository } from 'src/genres/genres.repository';
import {
  WithdrawalReasonsResponseDto,
  WithdrawUserBodyDto,
} from './dto/withdrawal.dto';
import { WithdrawalReasonsRepository } from './withdrawal-reasons.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly usersRepository: UsersRepository,
    private readonly genresRepository: GenresRepository,
    private readonly withdrawalReasonsRepository: WithdrawalReasonsRepository,
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
        genre: true,
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

    const existUser = await this.usersRepository.findUniqueOne({
      where: { id: targetId },
    });
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    if ('birthDay' in body && typeof body.birthDay === 'string') {
      const birthDayDate = new Date(body.birthDay);
      body.birthDay = birthDayDate;
    }
    if ('genres' in body && typeof body.genres !== undefined) {
      const genres = await this.genresRepository.findAll({
        where: {
          user: {
            some: { id: targetId },
          },
        },
      });
      genres.map(async (genre) => {
        await this.usersRepository.update({
          where: { id: targetId },
          data: {
            genre: {
              disconnect: {
                id: genre.id,
              },
            },
          },
        });
      });
      body.genres.map(async (genre) => {
        await this.usersRepository.update({
          where: { id: targetId },
          data: {
            genre: {
              connect: { id: genre.id },
            },
          },
        });
      });
    }
    const { genres: _genres, ...updateData } = body;
    const updateUserQuery: Prisma.UsersUpdateArgs = {
      where: { id: targetId },
      data: { ...updateData },
    };
    await this.usersRepository.update(updateUserQuery);

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

  async withdraw(
    id: string,
    targetId: string,
    body: WithdrawUserBodyDto,
  ): Promise<CommonDto> {
    this.checkPermission(id, targetId);

    const existUser = await this.usersRepository.findUniqueOne({
      where: { id: targetId, status: UserStatus.ACTIVE },
    });
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    const { withdrawalReasonsId, ...updateData } = body;
    const createWithdrawalQuery: Prisma.UsersUpdateArgs = {
      where: { id: targetId },
      data: {
        withdrawals: { create: { withdrawalReasonsId } },
        deletedAt: new Date(),
        status: UserStatus.DEACTIVE,
      },
    };
    const withdrawalReasonsOther =
      await this.withdrawalReasonsRepository.findUnique({
        where: { id: withdrawalReasonsId },
      });
    if (withdrawalReasonsOther.name === 'OTHER' && updateData.content) {
      createWithdrawalQuery.data.withdrawals.update = {
        data: { content: updateData.content },
      };
    }
    await this.usersRepository.update(createWithdrawalQuery);

    this.logService.verbose(`Withdraw user - ${id}`, UsersService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User withdraw',
    };
  }

  async findWithdrawReasons(): Promise<WithdrawalReasonsResponseDto> {
    const withdrawalReasons = await this.withdrawalReasonsRepository.findAll();
    this.logService.verbose(`find Withdrawal Reasons`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Find Withdrawal Reasons',
      withdrawalReasons,
    };
  }

  private checkPermission(userId: string, targetId: string): boolean {
    if (userId !== targetId) {
      throw new ForbiddenException('Forbidden resource');
    }
    return;
  }
}

import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { LogService } from 'src/common/log.service';
import { RedisRepository } from 'src/database/redis.repository';
import { PrismaService } from '../database/prisma.service';
import { CreateUserResponseDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly prismaService: PrismaService,
    private readonly redisRepository: RedisRepository,
    private readonly authService: AuthService,
  ) {}

  async create(body: any): Promise<CreateUserResponseDto> {
    const { phoneNumber, birthDay, ...data } = body;
    const birthDayDate = new Date(birthDay);

    const key = `signUp:${phoneNumber}`;
    const verifiedPhoneNumber = await this.redisRepository.get(key);
    if (!verifiedPhoneNumber) {
      throw new UnauthorizedException('Phone number is not verified');
    }
    const { isVerified } = JSON.parse(verifiedPhoneNumber);
    if (!isVerified) {
      throw new UnauthorizedException('Phone number is not verified');
    }

    const newUsers: Users = await this.prismaService.users.create({
      data: {
        phoneNumber,
        birthDay: birthDayDate,
        ...data,
      },
    });
    this.logService.verbose(
      `New user created - ${newUsers.id} ${newUsers.name}`,
      UsersService.name,
    );
    const { accessToken } = await this.authService.createAccessToken(
      newUsers.id,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created',
      data: newUsers.id,
      token: accessToken,
    };
  }
}

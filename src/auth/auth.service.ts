import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Users, UserStatus } from '@prisma/client';
import { CommonDto } from '@common/dto/common.dto';
import {
  LoginBody,
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
  VerifyPhoneNumberCodeResponseDto,
} from './dto/auth.dto';
import { SignUpBody, SignUpResponseDto } from './dto/sign-up.dto';
import { LogService } from '@common/log.service';
import { RedisRepository } from 'database/redis.repository';
import { SimpleNotificationService } from '@service/simple-notification/simple-notification.service';
import { UserRepository } from '@user/user.repository';
import { generateSignUpCode } from '@common/util/code-generator';
import { GenresDto } from '@genre/dto/genres.dto';

const EXPIRE = 60 * 3; // 3 min

@Injectable()
export class AuthService {
  constructor(
    private readonly logService: LogService,
    private readonly redisRepository: RedisRepository,
    private readonly simpleNotificationService: SimpleNotificationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async sendPhoneNumberCode(body: SendPhoneNumberCodeBody): Promise<CommonDto> {
    const { phoneNumber } = body;

    const existedUser = await this.userRepository.findOne({
      where: { phoneNumber, status: UserStatus.ACTIVE },
    });
    const { key, code } = generateSignUpCode(phoneNumber);
    const isVerified = existedUser ? true : false;
    const value = { isVerified, code };
    await this.redisRepository.set(key, JSON.stringify(value), EXPIRE);
    await this.simpleNotificationService.publishSms(phoneNumber, code);
    this.logService.verbose(
      `Successfully sent a phone number code to ${phoneNumber}`,
      AuthService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully send the phone number code.',
    };
  }

  async verifyPhoneNumberCode(
    body: VerifyPhoneNumberCodeBody,
  ): Promise<VerifyPhoneNumberCodeResponseDto> {
    const { phoneNumber, code } = body;
    const key = `signUp:${phoneNumber}`;
    const existed = await this.redisRepository.get(key);
    if (!existed) {
      throw new BadRequestException('The code has been expired.');
    }
    const { isVerified, code: savedCode } = JSON.parse(existed);
    if (code !== savedCode) {
      throw new BadRequestException('The code is incorrect.');
    }
    if (isVerified) {
      const existedUser = await this.userRepository.findOne({
        where: { phoneNumber, status: UserStatus.ACTIVE },
      });
      const { accessToken } = await this.createAccessToken(existedUser.id);
      this.logService.verbose(
        `Successfully verified the phone number code for ${phoneNumber}`,
        AuthService.name,
      );
      return {
        statusCode: HttpStatus.OK,
        message: `Successfully verified the existed phone number.`,
        user: existedUser,
        token: accessToken,
      };
    } else {
      await this.redisRepository.set(key, JSON.stringify({ isVerified: true }));
      this.logService.verbose(
        `Successfully verified the phone number code for ${phoneNumber}`,
        AuthService.name,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully verified the phone number code.',
        token: undefined,
      };
    }
  }
  async create(body: SignUpBody): Promise<SignUpResponseDto> {
    const { phoneNumber, birthDay, genres, ...data } = body;
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
    const newUser: Users = await this.createUserAndGenres(
      {
        phoneNumber,
        birthDay: birthDayDate,
        ...data,
      },
      genres,
    );
    const { accessToken } = await this.createAccessToken(newUser.id);
    this.logService.verbose(
      `Successfully signed up - ${newUser.id}`,
      AuthService.name,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully sign up',
      user: newUser,
      token: accessToken,
    };
  }

  private async createAccessToken(
    id: string,
  ): Promise<{ accessToken: string }> {
    const payload = { id };
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRE_IN');
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
    return {
      accessToken,
    };
  }

  private async createUserAndGenres(
    userData: SignUpBody,
    genresData: Array<Pick<GenresDto, 'id'>>,
  ): Promise<Users> {
    const createUserQuery: Prisma.UsersCreateArgs = {
      data: {
        ...userData,
        genre: {
          connect: genresData.map((genre) => ({ id: genre.id })),
        },
      },
    };
    return await this.userRepository.create(createUserQuery);
  }

  // NOTE: This is a temporary implementation for the test.
  async login(body: LoginBody) {
    const { id } = body;
    const existedUser = await this.userRepository.findUniqueOne({
      where: { id },
    });
    if (!existedUser) {
      throw new UnauthorizedException('User not found');
    }
    const { accessToken } = await this.createAccessToken(existedUser.id);
    this.logService.verbose('Successfully logged in', AuthService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully logged in',
      user: existedUser,
      token: accessToken,
    };
  }
}

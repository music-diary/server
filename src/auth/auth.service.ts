import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { RedisRepository } from 'src/database/redis.repository';
import { SimpleNotificationService } from 'src/simple-notification/simple-notification.service';
import { UsersService } from 'src/users/users.service';
import {
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
} from './dto/auth.dto';
import { LoginBody, LoginResponseDto } from './dto/login.dto';
import { SignUpResponseDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logService: LogService,
    private readonly redisRepository: RedisRepository,
    private readonly simpleNotificationService: SimpleNotificationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async sendPhoneNumberCode(body: SendPhoneNumberCodeBody): Promise<CommonDto> {
    const { phoneNumber } = body;

    const key = `signUp:${phoneNumber}`;
    const code = Math.floor(Math.random() * 100_000)
      .toString()
      .padStart(6, '0');
    const value = { isVerified: false, code };
    const expire = 60 * 3; // 3 min
    await this.redisRepository.set(key, JSON.stringify(value), expire);

    await this.simpleNotificationService.publishSms(phoneNumber, code);
    const isExist = await this.redisRepository.get(key);
    if (isExist) {
      await this.redisRepository.set(key, JSON.stringify(value), expire);
    }
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
  ): Promise<CommonDto> {
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
    if (!isVerified) {
      await this.redisRepository.set(key, JSON.stringify({ isVerified: true }));
    }
    this.logService.verbose(
      `Successfully verified the phone number code for ${phoneNumber}`,
      AuthService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully verified the phone number code.',
    };
  }
  async create(body: any): Promise<SignUpResponseDto> {
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
    const newUser = await this.usersService.create(
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
      data: newUser.id,
      token: accessToken,
    };
  }

  async login(body: LoginBody): Promise<LoginResponseDto> {
    const { phoneNumber } = body;
    const key = `signUp:${phoneNumber}`;
    const isVerifiedUser = await this.redisRepository.get(key);
    const { isVerified } = JSON.parse(isVerifiedUser);
    if (!isVerified) {
      throw new UnauthorizedException('Phone number is not verified');
    }
    const result = await this.usersService.findOne({
      where: {
        phoneNumber,
      },
    });
    if (!result.data) {
      throw new NotFoundException('User not found');
    }
    const { accessToken } = await this.createAccessToken(result.data.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully login',
      data: result.data.id,
      token: accessToken,
    };
  }

  async createAccessToken(id: string): Promise<{ accessToken: string }> {
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
}

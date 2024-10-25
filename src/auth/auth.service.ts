import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, ProviderTypes, Role, Users, UserStatus } from '@prisma/client';
import { CommonDto } from '@common/dto/common.dto';
import {
  LoginBody,
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
  VerifyPhoneNumberCodeResponseDto,
} from './dto/auth.dto';
import { SignUpBody, SignUpResponseDto } from './dto/sign-up.dto';
import { LogService } from '@common/log.service';
import { RedisRepository } from '@database/redis.repository';
import { SimpleNotificationService } from '@service/simple-notification/simple-notification.service';
import { UserRepository } from '@user/user.repository';
import { generateSignUpCode } from '@common/util/code-generator';
import { GenresDto } from '@genre/dto/genres.dto';
import { SponsorRepository } from '../users/sponsor.repository';
import { decrypt } from '@common/util/crypto';
import { TEST_ACCOUNT_PHONE_NUMBER } from '@common/consts/data.const';

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
    private readonly sponsorRepository: SponsorRepository,
  ) {}

  async sendPhoneNumberCode(body: SendPhoneNumberCodeBody): Promise<CommonDto> {
    const { phoneNumber } = body;

    // NOTE: App Test 심사용
    if (phoneNumber === TEST_ACCOUNT_PHONE_NUMBER) {
      const key = `signUp:${phoneNumber}`;
      const value = { isVerified: true, isSponsor: false };
      await this.redisRepository.set(key, JSON.stringify(value));
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully send the phone number code for test account.',
      };
    }

    const isSponsor = await this.validateSponsor(phoneNumber);
    const existedUser = await this.userRepository.findOne({
      where: { phoneNumber, status: UserStatus.ACTIVE },
    });
    const { key, code } = generateSignUpCode(phoneNumber);
    const isVerified = existedUser ? true : false;
    const value = { isVerified, code, isSponsor };
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
    const { isVerified, code: savedCode, isSponsor } = JSON.parse(existed);
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
      await this.redisRepository.set(
        key,
        JSON.stringify({ isVerified: true, isSponsor }),
      );
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

  // FIXME: DELETE THIS LATER
  // async create(body: SignUpBody): Promise<SignUpResponseDto> {
  //   const { phoneNumber, birthDay, genres, ...data } = body;
  //   const birthDayDate = new Date(birthDay);

  //   const key = `signUp:${phoneNumber}`;
  //   const verifiedPhoneNumber = await this.redisRepository.get(key);
  //   if (!verifiedPhoneNumber) {
  //     throw new UnauthorizedException('Phone number is not verified');
  //   }
  //   const { isVerified, isSponsor } = JSON.parse(verifiedPhoneNumber);
  //   if (!isVerified) {
  //     throw new UnauthorizedException('Phone number is not verified');
  //   }
  //   const newUser: Users = await this.createUserAndGenres(
  //     {
  //       phoneNumber,
  //       birthDay: birthDayDate,
  //       role: isSponsor ? Role.SPONSOR : Role.USER,
  //       ...data,
  //     },
  //     genres,
  //   );
  //   const { accessToken } = await this.createAccessToken(newUser.id);
  //   this.logService.verbose(
  //     `Successfully signed up - ${newUser.id}`,
  //     AuthService.name,
  //   );
  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'Successfully sign up',
  //     user: newUser,
  //     token: accessToken,
  //   };
  // }

  async create(body: SignUpBody): Promise<SignUpResponseDto> {
    const { phoneNumber, birthDay, genres, idToken, ...data } = body;
    const birthDayDate = new Date(birthDay);
    const key = `signUp:${idToken}`;
    const verified = await this.redisRepository.get(key);
    console.log('create verified: ', verified);
    if (!verified) {
      throw new UnauthorizedException('The token is not verified');
    }
    const { email, providerType } = JSON.parse(verified);
    const newUser = await this.createUserAndGenres(
      {
        email,
        idToken,
        providerType,
        phoneNumber,
        birthDay: birthDayDate,
        ...data,
      },
      genres,
    );
    console.log('create newUser: ', newUser);
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
    return { accessToken };
  }

  private async createUserAndGenres(
    userData: SignUpBody,
    genresData: Array<Pick<GenresDto, 'id'>>,
  ): Promise<Users> {
    const { idToken, ...data } = userData;
    const createUserQuery: Prisma.UsersCreateArgs = {
      data: {
        ...data,
        providerId: idToken,
        genre: {
          connect: genresData.map((genre) => ({ id: genre.id })),
        },
      },
    };
    return await this.userRepository.create(createUserQuery);
  }

  private async validateSponsor(phoneNumber: string): Promise<boolean> {
    const sponsors = await this.redisRepository.get('sponsors');
    const sponsorPhoneNumbers = sponsors
      ? JSON.parse(sponsors)
      : await this.fetchAndCacheSponsors();

    return sponsorPhoneNumbers.some((phone: string) =>
      this.isPhoneNumberMatch(phone, phoneNumber),
    );
  }

  private async fetchAndCacheSponsors(): Promise<string[]> {
    const allSponsors = await this.sponsorRepository.findMany({});
    const sponsorPhoneNumbers = allSponsors.map(
      (sponsor) => sponsor.phoneNumber,
    );
    await this.redisRepository.set(
      'sponsors',
      JSON.stringify(sponsorPhoneNumbers),
    );
    return sponsorPhoneNumbers;
  }

  private isPhoneNumberMatch(phone: string, phoneNumber: string): boolean {
    try {
      return decrypt(phone) === phoneNumber;
    } catch (error) {
      console.error('Decryption error:', error);
      return false;
    }
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

  async oauthLogin(user: any) {
    console.log('oauthLogin user: ', user);
    const key = `signUp:${user.id}`;
    const existed = await this.redisRepository.get(key);
    console.log('oauthLogin existed cache: ', existed);
    if (!existed) {
      const value = { email: user.email, providerType: user.providerType };
      await this.redisRepository.set(key, JSON.stringify(value));
      await this.userRepository.create({
        data: {
          email: user.email,
          providerType: user.providerType,
          providerId: user.id,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully logged in',
        data: undefined,
        token: undefined,
      };
    }
    const { accessToken } = await this.createAccessToken(user.id);
    console.log('oauthLogin accessToken: ', accessToken);
    const existedUser = await this.userRepository.findOne({
      where: { providerId: user.id },
    });
    console.log('oauthLogin existedUser: ', existedUser);
    this.logService.verbose('Successfully logged in', AuthService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully logged in',
      data: existedUser,
      token: accessToken,
    };
  }

  async validateOAuthUser(profile: any, providerType: ProviderTypes) {
    try {
      console.log('validateOAuthUser profile: ', profile);
      console.log('validateOAuthUser providerType: ', providerType);
      // 기존 사용자 확인
      const existedUser = await this.userRepository.findOne({
        where: {
          providerType,
          providerId: profile.providerId,
        },
      });
      console.log('validateOAuthUser existedUser: ', existedUser);

      const user = existedUser
        ? await this.userRepository.update({
            where: { id: existedUser.id },
            data: { email: profile.email },
          })
        : await this.userRepository.create({
            data: {
              email: profile.email,
              name:
                profile.name ??
                profile.firstName + profile.lastName ??
                undefined,
              providerType: ProviderTypes.GOOGLE,
              providerId: profile.id,
            },
          });
      console.log('validateOAuthUser user: ', user);

      return user;
    } catch (error) {
      this.logService.error(error, AuthService.name);
      throw new UnauthorizedException('Failed to validate OAuth login');
    }
  }
}

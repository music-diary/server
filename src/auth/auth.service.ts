import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { RedisRepository } from 'src/database/redis.repository';
import { SimpleNotificationService } from 'src/simple-notification/simple-notification.service';
import {
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logService: LogService,
    private readonly redisRepository: RedisRepository,
    private readonly simpleNotificationService: SimpleNotificationService,
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
}

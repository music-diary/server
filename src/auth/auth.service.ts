import { Injectable } from '@nestjs/common';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { RedisRepository } from 'src/database/redis.repository';
import { SimpleNotificationService } from 'src/simple-notification/simple-notification.service';
import { SendPhoneNumberCodeBody } from './dto/auth.dto';

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
      statusCode: 200,
      message: isExist,
    };
  }
}

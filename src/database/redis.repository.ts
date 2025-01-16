import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  protected client: Redis;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Redis(this.configService.get('REDIS_URL'));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: string, seconds?: number): Promise<void> {
    await this.client.set(key, value, 'EX', seconds ?? Number.MAX_SAFE_INTEGER);
  }

  async get(key: string): Promise<string> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  protected readonly client: Redis;
  constructor(private readonly configService: ConfigService) {
    if (!this.client) {
      const redisOptions = {
        host: this.configService.get('REDIS_HOST'),
        port: this.configService.get('REDIS_PORT'),
      };
      this.client = Redis.createClient();
      this.client.options = redisOptions;
      return this;
    }
    return this;
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async set(key: string, value: string, seconds?: number): Promise<void> {
    await this.client.set(key, value, 'EX', seconds ?? Number.MAX_SAFE_INTEGER);
  }

  async get(key: string): Promise<string> {
    return this.client.get(key);
  }

  async disconnect(): Promise<void> {
    this.client.disconnect();
  }
}

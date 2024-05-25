import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository {
  protected readonly client: Redis;
  constructor() {
    if (!this.client) {
      this.client = Redis.createClient();
      return;
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

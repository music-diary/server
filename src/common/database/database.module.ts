import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { PrismaService } from './prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisRepository } from './redis.repository';
import { validationSchema } from '@common/config/validation-schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        options: {
          url: configService.get('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    DynamooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        aws: {
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
          region: configService.get('AWS_REGION'),
        },
        local: false,
        table: {
          create: false,
        },
      }),
    }),
  ],
  providers: [PrismaService, RedisRepository],
  exports: [PrismaService, RedisRepository, CacheModule, DynamooseModule],
})
export class DatabaseModule {}

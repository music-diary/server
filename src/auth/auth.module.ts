import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogService } from '@common/log.service';
import { RedisRepository } from '@common/database/redis.repository';
import { SimpleNotificationService } from '@service/simple-notification/simple-notification.service';
import { UserRepository } from '@user/user.repository';
import { PrismaService } from '@common/database/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LogService,
    RedisRepository,
    SimpleNotificationService,
    JwtService,
    UserRepository,
    PrismaService,
  ],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { RedisRepository } from 'src/database/redis.repository';
import { SimpleNotificationService } from 'src/simple-notification/simple-notification.service';
import { UserRepository } from 'src/users/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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

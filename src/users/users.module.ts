import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { RedisRepository } from 'src/database/redis.repository';
import { SimpleNotificationService } from 'src/simple-notification/simple-notification.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    LogService,
    PrismaService,
    RedisRepository,
    AuthService,
    SimpleNotificationService,
    JwtService,
  ],
})
export class UsersModule {}

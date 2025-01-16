import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogService } from '@common/log.service';
import { RedisRepository } from '@database/redis.repository';
import { SimpleNotificationService } from '@service/simple-notification/simple-notification.service';
import { UserRepository } from '@user/user.repository';
import { PrismaService } from '@database/prisma/prisma.service';
import { SponsorRepository } from '@user/sponsor.repository';
import { PassportModule } from '@nestjs/passport';
import { GoogleTokenStrategy } from '@common/strategies/google.strategy';
import { AppleTokenStrategy } from '@common/strategies/apple.strategy';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [AuthController],
  providers: [
    AuthService,
    LogService,
    RedisRepository,
    SimpleNotificationService,
    JwtService,
    UserRepository,
    SponsorRepository,
    PrismaService,
    GoogleTokenStrategy,
    AppleTokenStrategy,
  ],
})
export class AuthModule {}

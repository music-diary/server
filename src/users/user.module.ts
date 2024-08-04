import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { WithdrawalReasonsRepository } from './withdrawal-reasons.repository';
import { ContactRepository } from './contact.repository';
import { StatisticRepository } from './statistic.repository';
import { LogService } from '@common/log.service';
import { PrismaService } from '@common/database/prisma.service';
import { GenreRepository } from '@genre/genre.repository';
import { SimpleEmailService } from '@service/simple-email/simple-email.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    LogService,
    PrismaService,
    JwtService,
    UserRepository,
    GenreRepository,
    WithdrawalReasonsRepository,
    ContactRepository,
    StatisticRepository,
    SimpleEmailService,
  ],
})
export class UserModule {}

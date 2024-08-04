import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { GenreRepository } from 'src/genres/genre.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { WithdrawalReasonsRepository } from './withdrawal-reasons.repository';
import { SimpleEmailService } from 'src/simple-email/simple-email.service';
import { ContactRepository } from './contact.repository';
import { StatisticRepository } from './statistic.repository';

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

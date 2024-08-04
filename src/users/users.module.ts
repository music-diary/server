import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { GenreRepository } from 'src/genres/genre.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { WithdrawalReasonsRepository } from './withdrawal-reasons.repository';
import { SimpleEmailService } from 'src/simple-email/simple-email.service';
import { ContactRepository } from './contact.repository';
import { StatisticRepository } from './statistic.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    LogService,
    PrismaService,
    JwtService,
    UsersRepository,
    GenreRepository,
    WithdrawalReasonsRepository,
    ContactRepository,
    StatisticRepository,
    SimpleEmailService,
  ],
})
export class UsersModule {}

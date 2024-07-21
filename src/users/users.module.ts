import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { GenresRepository } from 'src/genres/genres.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { WithdrawalReasonsRepository } from './withdrawal-reasons.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    LogService,
    PrismaService,
    JwtService,
    UsersRepository,
    GenresRepository,
    WithdrawalReasonsRepository,
  ],
})
export class UsersModule {}

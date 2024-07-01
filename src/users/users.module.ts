import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { GenresRepository } from 'src/genres/genres.repository';
import { UserGenresRepository } from './user-genres.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    LogService,
    PrismaService,
    JwtService,
    UsersRepository,
    UserGenresRepository,
    GenresRepository,
  ],
})
export class UsersModule {}

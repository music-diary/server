import { Module } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, LogService, PrismaService, JwtService],
})
export class UsersModule {}

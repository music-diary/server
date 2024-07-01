import { Module } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { GenresController } from './genres.controller';
import { GenresRepository } from './genres.repository';
import { GenresService } from './genres.service';

@Module({
  controllers: [GenresController],
  providers: [GenresService, LogService, PrismaService, GenresRepository],
})
export class GenresModule {}

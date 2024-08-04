import { Module } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { GenreController } from './genre.controller';
import { GenresRepository } from './genre.repository';
import { GenreService } from './genre.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService, LogService, PrismaService, GenresRepository],
})
export class GenresModule {}

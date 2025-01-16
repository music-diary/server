import { Module } from '@nestjs/common';
import { LogService } from '@common/log.service';
import { PrismaService } from '@database/prisma/prisma.service';
import { GenreController } from './genre.controller';
import { GenreRepository } from './genre.repository';
import { GenreService } from './genre.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService, LogService, PrismaService, GenreRepository],
})
export class GenreModule {}

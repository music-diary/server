import { HttpStatus, Injectable } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { findAllGenresResponse } from './dto/find.dto';
import { GenresRepository } from './genres.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class GenresService {
  constructor(
    private readonly logService: LogService,
    private readonly genresRepository: GenresRepository,
  ) {}

  async findAll(): Promise<findAllGenresResponse> {
    this.logService.verbose('Find all genres', GenresService.name);
    const findParams: Prisma.GenresFindManyArgs = {
      orderBy: {
        order: 'asc',
      },
    };
    const genres = await this.genresRepository.findAll(findParams);
    return {
      statusCode: HttpStatus.OK,
      message: 'Find all genres',
      genres,
    };
  }
}

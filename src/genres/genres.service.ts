import { HttpStatus, Injectable } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { findAllGenresResponse } from './dto/find.dto';

@Injectable()
export class GenresService {
  constructor(
    private readonly logService: LogService,
    private readonly prismaService: PrismaService,
  ) {}

  async findAll(): Promise<findAllGenresResponse> {
    this.logService.verbose('Find all genres', GenresService.name);
    const genres = await this.prismaService.genres.findMany();
    return {
      statusCode: HttpStatus.OK,
      message: 'Find all genres',
      data: genres,
    };
  }
}

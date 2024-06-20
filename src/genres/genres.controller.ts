import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { findAllGenresResponse } from './dto/find.dto';
import { GenresService } from './genres.service';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @ApiOperation({ summary: 'Find all genres' })
  @Get()
  findAll(): Promise<findAllGenresResponse> {
    return this.genresService.findAll();
  }
}

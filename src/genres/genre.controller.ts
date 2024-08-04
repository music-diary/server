import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { findAllGenresResponse } from './dto/find.dto';
import { GenreService } from './genre.service';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @ApiOperation({ summary: 'Find all genres' })
  @Get()
  findAll(): Promise<findAllGenresResponse> {
    return this.genreService.findAll();
  }
}

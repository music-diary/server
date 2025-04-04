import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@common/dto/common.dto';
import { GenresDto } from './genres.dto';

export class findAllGenresResponse extends CommonDto {
  @ApiProperty({ description: 'The genres' })
  genres: GenresDto[];
}

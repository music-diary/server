import { ApiProperty } from '@nestjs/swagger';
import { Genres } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';

export class findAllGenresResponse extends CommonDto {
  @ApiProperty({ description: 'The genres' })
  data: Genres[];
}

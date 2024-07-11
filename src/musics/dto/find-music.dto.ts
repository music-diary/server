import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from 'src/common/common.dto';
import { MusicsDto } from './musics.dto';

export class FindAllMusicsResponse extends CommonDto {
  @ApiProperty({ type: MusicsDto, isArray: true })
  musics: MusicsDto[];
}

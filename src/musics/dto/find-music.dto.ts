import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from 'src/common/common.dto';
import { MusicModelDto, MusicsDto } from './musics.dto';

export class FindAllMusicsResponse extends CommonDto {
  @ApiProperty({ type: MusicsDto, isArray: true })
  musics: MusicsDto[];
}

export class FindMusicCandidatesResponse extends CommonDto {
  @ApiProperty({ type: MusicsDto, isArray: true })
  musics: MusicsDto[];
}

export class FindMusicResponse extends CommonDto {
  @ApiProperty({ type: MusicModelDto })
  music: MusicModelDto;
}

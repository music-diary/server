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

export class FindMusicsResponse extends CommonDto {
  @ApiProperty()
  musics: Partial<MusicsDto>[];
}

export class FindMusicsModelResponse extends CommonDto {
  @ApiProperty({ type: MusicModelDto, isArray: true })
  musics: MusicModelDto[];
}

export class FindMusicsArchiveResponse extends CommonDto {
  @ApiProperty()
  musics: Partial<MusicsDto>[];

  @ApiProperty()
  count: any;
}

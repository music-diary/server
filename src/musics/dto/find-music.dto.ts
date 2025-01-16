import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@common/dto/common.dto';
import { MusicAiModelDto, MusicsDto } from './musics.dto';

export class FindAllMusicsResponse extends CommonDto {
  @ApiProperty({ type: MusicsDto, isArray: true })
  musics: MusicsDto[];
}

export class FindAllMusicsArchiveResponse extends CommonDto {
  @ApiProperty()
  data: unknown;
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
  @ApiProperty({ type: MusicAiModelDto, isArray: true })
  musics: MusicAiModelDto[];
}

export class FindMusicsArchiveSummaryResponse extends CommonDto {
  @ApiProperty()
  musics?: MusicsDto[];
  @ApiProperty()
  summary: unknown;
}

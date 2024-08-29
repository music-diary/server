import { ApiProperty } from '@nestjs/swagger';
import { MusicAiModelDto } from './musics.dto';
import { IsString } from 'class-validator';

export class CreateDiaryMusicBodyDto {
  @ApiProperty({ type: MusicAiModelDto, isArray: true })
  musics: MusicAiModelDto[];

  @ApiProperty()
  @IsString()
  diaryId: string;
}

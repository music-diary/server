import { ApiProperty } from '@nestjs/swagger';
import { MusicModelDto } from './musics.dto';
import { IsString } from 'class-validator';

export class CreateDiaryMusicBodyDto {
  @ApiProperty({ type: MusicModelDto, isArray: true })
  musics: MusicModelDto[];

  @ApiProperty()
  @IsString()
  diaryId: string;
}

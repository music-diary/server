import { ApiProperty } from '@nestjs/swagger';
import { Musics } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MusicAiModel } from '@music/schema/music-ai.type';

export class MusicsDto implements Musics {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  songId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  artist: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  albumUrl: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  selectedLyric: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lyric: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  originalGenre: string | null;

  @ApiProperty()
  @IsBoolean()
  selected: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsString()
  youtubeUrl: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  editorPick: string | null;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  diaryId: string | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  deletedAt: Date | null;
}

export class MusicAiModelDto implements MusicAiModel {
  @ApiProperty()
  @IsString()
  songId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  artist: string;

  @ApiProperty()
  @IsString()
  editor_name: string;

  @ApiProperty()
  @IsString()
  editor_pick: string;

  @ApiProperty()
  @IsString()
  albumUrl: string;

  @ApiProperty()
  @IsString()
  feelings: string;

  @ApiProperty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsString()
  lyric: string;

  @ApiProperty()
  @IsString()
  videoId: string;

  @ApiProperty()
  @IsString()
  yt_url: string;
}

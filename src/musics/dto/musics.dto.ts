import { ApiProperty } from '@nestjs/swagger';
import { Musics } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MusicModel } from '../schema/music.type';

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

export class MusicModelDto implements MusicModel {
  @ApiProperty()
  @IsString()
  songId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  artist?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  albumUrl?: string | null;

  @ApiProperty()
  @IsString()
  feelings: string;

  @ApiProperty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lyric?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  editor?: string;
}

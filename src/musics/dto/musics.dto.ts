import { ApiProperty } from '@nestjs/swagger';
import { Musics } from '@prisma/client';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class MusicsDto implements Musics {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  artist: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  album: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  albumImageUrl: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  selectedLyrics: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fullLyrics: string | null;

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
}

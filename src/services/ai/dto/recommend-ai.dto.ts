import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class RecommendMusicToAIBodyDto {
  @ApiProperty()
  @IsString()
  data: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @Type(() => String)
  selected_genres: Array<string>;

  @ApiProperty()
  @IsNumber()
  selected_feeling: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @Type(() => Number)
  selected_feeling_2: Array<number>;

  @ApiProperty()
  @IsNumber()
  genre_yn: number;

  @ApiProperty()
  @IsString()
  userId: string;
}

export class RecommendMusicToAIResponseDto {
  @ApiProperty()
  @IsObject()
  @IsOptional()
  'editor_pick'?: { [key: string]: string };

  @ApiProperty()
  @IsObject()
  @IsOptional()
  'similarity'?: { [key: string]: number };

  @ApiProperty()
  @IsObject()
  @IsOptional()
  'songId'?: { [key: string]: number };
}

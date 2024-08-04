import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class RecommendMusicToAIBodyDto {
  @ApiProperty()
  @IsString()
  data: string;
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

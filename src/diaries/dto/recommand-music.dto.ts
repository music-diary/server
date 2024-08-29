import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { CommonDto } from '@common/dto/common.dto';
import { MusicAiModelDto } from '@music/dto/musics.dto';
export class RecommendMusicResponseDto extends CommonDto {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  musics?: MusicAiModelDto[];

  data?: any;
}

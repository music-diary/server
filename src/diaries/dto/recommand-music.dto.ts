import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { MusicModelDto } from 'src/musics/dto/musics.dto';

export class RecommendMusicResponseDto extends CommonDto {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  musics?: MusicModelDto[];

  data?: any;
}

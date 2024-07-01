import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { EmotionsDto } from './emotions.dto';

export class FindEmotionsResponseDto extends CommonDto {
  @ApiProperty({ type: [EmotionsDto] })
  @IsArray()
  @Type(() => EmotionsDto)
  emotions: EmotionsDto[];
}

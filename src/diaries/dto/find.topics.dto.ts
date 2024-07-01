import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { TopicsDto } from './topics.dto';

export class FindTopicsResponseDto extends CommonDto {
  @ApiProperty({ type: [TopicsDto] })
  @IsArray()
  @Type(() => TopicsDto)
  topics: TopicsDto[];
}

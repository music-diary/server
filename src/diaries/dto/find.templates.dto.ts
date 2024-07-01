import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { TemplatesDto } from './templates.dto';

export class FindTemplatesResponseDto extends CommonDto {
  @ApiProperty({ type: [TemplatesDto] })
  @IsArray()
  @Type(() => TemplatesDto)
  templates: TemplatesDto[];
}

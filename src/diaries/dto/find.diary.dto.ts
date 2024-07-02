import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { DiaryDto } from './diaries.dto';

export class FindDiariesResponseDto extends CommonDto {
  @ApiProperty({ type: [DiaryDto] })
  @IsArray()
  @Type(() => DiaryDto)
  diaries: any[];
}

export class FindDiaryResponseDto extends CommonDto {
  @ApiProperty({ type: DiaryDto })
  @Type(() => DiaryDto)
  diary: any;
}

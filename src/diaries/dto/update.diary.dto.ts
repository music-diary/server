import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { DiaryDto } from './diaries.dto';
import { TopicsDto } from './topics.dto';

export class UpdateDiaryBodyDto extends PickType(DiaryDto, [
  'title',
  'content',
  'emotionId',
  'templateId',
  'status',
]) {
  @ApiProperty({ type: TopicsDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => TopicsDto)
  topics: TopicsDto[] | null;
}

export class UpdateDiaryResponseDto extends CommonDto {
  @ApiProperty({ description: 'The diary id' })
  @IsUUID()
  diaryId: string;
}

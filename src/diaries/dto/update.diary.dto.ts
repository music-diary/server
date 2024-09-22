import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CommonDto } from '@common/dto/common.dto';
import { DiaryDto } from './diaries.dto';
import { TemplatesDto } from './templates.dto';
import { Type } from 'class-transformer';
import { TopicsDto } from './topics.dto';
import { EmotionsDto } from './emotions.dto';
import { MusicsDto } from '@music/dto/musics.dto';

export class UpdateDiaryBodyDto extends PickType(DiaryDto, [
  'title',
  'content',
  'status',
]) {
  @ApiProperty({ type: TemplatesDto })
  @Type(() => TemplatesDto)
  @IsOptional()
  templates?: TemplatesDto;

  @ApiProperty({ type: TopicsDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => TopicsDto)
  topics?: Array<TopicsDto>;

  @ApiProperty({ type: EmotionsDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => EmotionsDto)
  emotions?: Array<EmotionsDto>;

  @ApiProperty({ type: MusicsDto })
  @IsOptional()
  @Type(() => MusicsDto)
  music?: MusicsDto;
}

export class UpdateDiaryResponseDto extends CommonDto {
  @ApiProperty({ description: 'The diary id' })
  @IsUUID()
  diaryId: string;
}

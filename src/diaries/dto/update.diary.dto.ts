import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CommonDto } from '@common/dto/common.dto';
import { DiaryDto } from './diaries.dto';

export class UpdateDiaryBodyDto extends OmitType(DiaryDto, [
  'id',
  'userId',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'users',
  'templateId',
]) {}

export class UpdateDiaryResponseDto extends CommonDto {
  @ApiProperty({ description: 'The diary id' })
  @IsUUID()
  diaryId: string;
}

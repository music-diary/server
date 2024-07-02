import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { DiaryDto } from './diaries.dto';

export class UpdateDiaryBodyDto extends OmitType(DiaryDto, [
  'id',
  'userId',
  'createdAt',
  'updatedAt',
]) {}

export class UpdateDiaryResponseDto extends CommonDto {
  @ApiProperty({ description: 'The diary id' })
  @IsUUID()
  diaryId: string;
}

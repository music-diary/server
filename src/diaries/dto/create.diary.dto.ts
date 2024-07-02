import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { DiaryDto } from './diaries.dto';

export class CreateDiaryBodyDto extends PickType(DiaryDto, ['status']) {}

export class CreateDiaryResponseDto extends CommonDto {
  @ApiProperty({ description: 'The diary id' })
  @IsUUID()
  diaryId: string;
}

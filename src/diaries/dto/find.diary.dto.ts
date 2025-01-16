import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { CommonDto } from '@common/dto/common.dto';
import { DiaryDto } from './diaries.dto';
import { DiariesStatus } from '@prisma/client';

export class GetDiariesQueryDto {
  @ApiProperty({ required: false, type: 'enum', enum: DiariesStatus })
  @IsOptional()
  status?: DiariesStatus;
}

export class FindDiariesResponseDto extends CommonDto {
  @ApiProperty({ type: [DiaryDto] })
  @IsArray()
  @Type(() => DiaryDto)
  diaries: Partial<DiaryDto>[];
}

export class FindDiaryResponseDto extends CommonDto {
  @ApiProperty({ type: DiaryDto })
  @Type(() => DiaryDto)
  diary: Partial<DiaryDto>;
}

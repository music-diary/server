import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';

export enum StatisticsType {
  MONTH = 'month',
  YEAR = 'year',
}

export class GetStatisticsQuery {
  @ApiProperty({ enum: StatisticsType, required: true, example: 'MONTH' })
  @IsString()
  @IsEnum(StatisticsType)
  type: StatisticsType;

  @ApiProperty({ required: false, example: '2024-06' })
  @IsOptional()
  @IsString()
  month?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  year?: number | null;
}

export class GetStatisticsResponseDto extends CommonDto {
  @ApiProperty()
  data: any;
}

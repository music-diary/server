import { CommonDto } from '@common/dto/common.dto';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { WithdrawalReasons, Withdrawals } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class WithdrawalDto implements Withdrawals {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  withdrawalReasonsId: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class WithdrawReasonDto implements WithdrawalReasons {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class WithdrawUserBodyDto extends IntersectionType(
  PickType(WithdrawalDto, ['withdrawalReasonsId', 'content']),
) {}

export class WithdrawalReasonsResponseDto extends CommonDto {
  @ApiProperty({ type: [WithdrawReasonDto] })
  @Type(() => WithdrawReasonDto)
  withdrawalReasons: WithdrawReasonDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import {
  ContactHistory,
  ContactTypes,
  Gender,
  Genres,
  Users,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { CommonDto } from 'src/common/common.dto';

export class ContactTypesDto implements ContactTypes {
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

export class ContactHistoryDto implements ContactHistory {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  typeId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class SendContactBodyDto {
  @ApiProperty()
  @IsEmail()
  senderEmail: string;

  @ApiProperty()
  @IsUUID()
  contactTypeId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message: string | null;
}

export class ContactResponseDto extends CommonDto {
  @ApiProperty({ type: [ContactTypesDto] })
  @IsArray()
  @Type(() => ContactTypesDto)
  contactTypes: ContactTypesDto[];
}

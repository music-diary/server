import { CommonDto } from '@common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ContactHistory, ContactTypes } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

import { ApiProperty } from '@nestjs/swagger';
import { Emotions } from '@prisma/client';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class EmotionsDto implements Emotions {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  label: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  order: number | null;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  parentId: string | null;

  @ApiProperty()
  @IsNumber()
  level: number;
}

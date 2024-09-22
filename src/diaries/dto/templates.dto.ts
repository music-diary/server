import { ApiProperty } from '@nestjs/swagger';
import { TemplateContents, Templates } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class templateContentsDto implements TemplateContents {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  templateId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string | null;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  label: string;
}

export class TemplatesDto implements Templates {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ examples: ['SCS', 'KPT', 'MSG', '4L', '5F'] })
  @IsString()
  type: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  order: number | null;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isExample: boolean | null;

  @ApiProperty({ type: [templateContentsDto] })
  @IsOptional()
  @IsArray()
  @Type(() => templateContentsDto)
  templateContents?: templateContentsDto[];
}

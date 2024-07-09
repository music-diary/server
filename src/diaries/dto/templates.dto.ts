import { ApiProperty } from '@nestjs/swagger';
import { TemplateContents, Templates } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({ example: 'SCS' || 'KPT' || 'MSG' || '4L' || '5F' })
  @IsString()
  type: string;

  @ApiProperty({ type: templateContentsDto, isArray: true })
  @Type(() => templateContentsDto)
  templateContents: templateContentsDto[];
}

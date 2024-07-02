import { ApiProperty } from '@nestjs/swagger';
import { Templates, TemplateType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty()
  @IsEnum(TemplateType)
  type: TemplateType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  templateContent: JsonValue | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { Templates } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsOptional, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty()
  @IsOptional()
  @IsString()
  templateContent: JsonValue | null;
}

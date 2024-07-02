import { ApiProperty } from '@nestjs/swagger';
import { Topics } from '@prisma/client';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class TopicsDto implements Topics {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  label: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @IsOptional()
  emoji: string | null;
}

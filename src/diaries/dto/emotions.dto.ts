import { ApiProperty } from '@nestjs/swagger';
import { Emotions } from '@prisma/client';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class EmotionsDto implements Emotions {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  parentId: string | null;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  userId: string | null;
}

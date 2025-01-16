import { ApiProperty } from '@nestjs/swagger';
import { Genres } from '@prisma/client';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class GenresDto implements Genres {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  order: number | null;
}

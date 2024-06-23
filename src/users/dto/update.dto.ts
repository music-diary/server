import { ApiProperty } from '@nestjs/swagger';
import { Gender, Genres, Users } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserBodyDto implements Partial<Users> {
  @ApiProperty()
  @MaxLength(6, { message: 'The name length must be less than 6' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  birthDay?: Date;

  @ApiProperty()
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isGenreSuggested?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAgreedMarketing?: boolean;

  @ApiProperty({ example: [{ name: 'dance' }, { name: 'hip-hop' }] })
  @IsArray()
  @Type(() => Array<Pick<Genres, 'name'>>)
  @IsOptional()
  genres?: Pick<Genres, 'name'>[];
}

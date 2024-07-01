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
  name: string | null;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  birthDay: Date | null;

  @ApiProperty()
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender | null;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isGenreSuggested: boolean | null;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAgreedMarketing: boolean | null;
  @ApiProperty({
    isArray: true,
    example: [
      { id: 'dance-uuid', name: 'dance' },
      { id: 'hip-hop-uuid', name: 'hip-hop' },
    ],
  })
  @IsArray()
  @Type(() => Array<Genres>)
  @IsOptional()
  genres: Genres[] | null;
}

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
import { GenresDto } from 'src/genres/dto/genres.dto';

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

  @ApiProperty()
  @IsBoolean()
  IsAgreedDiaryAlarm: boolean;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  diaryAlarmTime: Date | null;

  @ApiProperty({
    isArray: true,
    type: GenresDto,
  })
  @IsArray()
  @Type(() => Array<GenresDto>)
  @IsOptional()
  genres: Genres[] | null;
}

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
  Matches,
  MaxLength,
} from 'class-validator';
import { GenresDto } from 'src/genres/dto/genres.dto';

export class UpdateUserBodyDto {
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
  @IsOptional()
  IsAgreedDiaryAlarm: boolean | null;

  @ApiProperty({ type: String, example: 'hh:mm' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'alarmTime must be in the format hh:mm',
  })
  diaryAlarmTime: string | null;

  @ApiProperty({
    isArray: true,
    type: Array<Pick<GenresDto, 'id'>>,
  })
  @IsArray()
  @Type(() => Array<Pick<GenresDto, 'id'>>)
  @IsOptional()
  genres: Array<Pick<GenresDto, 'id'>> | null;
}

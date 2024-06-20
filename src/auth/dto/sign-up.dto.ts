import { ApiProperty } from '@nestjs/swagger';
import { Genres } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { CommonDto } from 'src/common/common.dto';

enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER = 'OTHER',
}

export class SignUpBody {
  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @ApiProperty()
  @MaxLength(6, { message: 'The name length must be less than 6' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  birthDay: Date;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: [{ id: 'uuid', name: 'dance' }] })
  @IsArray()
  @Type(() => Array<Genres>)
  genres: Genres[];

  @ApiProperty()
  @IsBoolean()
  isGenreSuggested: boolean;

  @ApiProperty()
  @IsBoolean()
  isAgreedMarketing: boolean;
}

export class SignUpResponseDto extends CommonDto {
  @ApiProperty({ description: 'The user id' })
  data: string;

  @ApiProperty()
  token?: string;
}

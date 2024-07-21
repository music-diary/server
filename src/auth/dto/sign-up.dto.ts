import { ApiProperty, PickType } from '@nestjs/swagger';
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
import { GenresDto } from 'src/genres/dto/genres.dto';

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

  @ApiProperty({
    type: PickType(GenresDto, ['id']),
    isArray: true,
  })
  @IsArray()
  @Type(() => Array<Pick<GenresDto, 'id'>>)
  genres: Array<Pick<GenresDto, 'id'>>;

  @ApiProperty()
  @IsBoolean()
  isGenreSuggested: boolean;

  @ApiProperty()
  @IsBoolean()
  isAgreedMarketing: boolean;
}

export class SignUpResponseDto extends CommonDto {
  @ApiProperty({ description: 'The user id' })
  userId: string;

  @ApiProperty()
  token?: string;
}

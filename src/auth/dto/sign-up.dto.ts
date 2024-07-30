import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
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
import { UsersDto } from 'src/users/dto/user.dto';

enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER = 'OTHER',
}

export class SignUpBody extends PickType(UsersDto, [
  'phoneNumber',
  'name',
  'birthDay',
  'gender',
  'isGenreSuggested',
  'isAgreedMarketing',
]) {
  @ApiProperty({
    type: PickType(GenresDto, ['id']),
    isArray: true,
  })
  @IsArray()
  @Type(() => Array<Pick<GenresDto, 'id'>>)
  genres?: Array<Pick<GenresDto, 'id'>>;
}

export class SignUpResponseDto extends CommonDto {
  @ApiProperty({ type: UsersDto })
  @Type(() => UsersDto)
  user: UsersDto;

  @ApiProperty()
  token?: string;
}

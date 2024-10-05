import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { CommonDto } from '@common/dto/common.dto';
import { UsersDto } from '@user/dto/user.dto';
import { GenresDto } from '@genre/dto/genres.dto';
import { Role } from '@prisma/client';

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

  @ApiProperty({ type: Role, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class SignUpResponseDto extends CommonDto {
  @ApiProperty({ type: UsersDto })
  @Type(() => UsersDto)
  user: UsersDto;

  @ApiProperty()
  token?: string;
}

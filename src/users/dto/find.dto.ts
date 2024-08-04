import { CommonDto } from '@common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { UsersDto } from './user.dto';

export class FindUserResponseDto extends CommonDto {
  @ApiProperty({ type: UsersDto })
  @Type(() => Array<UsersDto>)
  user: Users;
}

export class FindAllUsersResponseDto extends CommonDto {
  @ApiProperty({ type: UsersDto, isArray: true })
  @IsArray()
  @Type(() => Array<UsersDto>)
  users: Array<Users>;
}

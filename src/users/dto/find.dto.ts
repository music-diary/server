import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';

export class FindUserResponseDto extends CommonDto {
  @ApiProperty()
  data: Users;
}

export class FindAllUsersResponseDto extends CommonDto {
  @ApiProperty()
  data: Users[];
}

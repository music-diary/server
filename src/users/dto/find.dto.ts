import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';

export class FindUserResponseDto extends CommonDto {
  @ApiProperty()
  user: Users;
}

export class FindAllUsersResponseDto extends CommonDto {
  @ApiProperty()
  users: Array<Users>;
}

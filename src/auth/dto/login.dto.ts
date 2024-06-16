import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';

export class LoginBody {
  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}

export class LoginResponseDto extends CommonDto {
  @ApiProperty({ description: 'The user id' })
  data: string;

  @ApiProperty()
  token?: string;
}

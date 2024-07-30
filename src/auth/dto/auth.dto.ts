import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';
import { UsersDto } from 'src/users/dto/user.dto';

export class SendPhoneNumberCodeBody {
  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}

export class VerifyPhoneNumberCodeBody {
  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  code: string;
}

export class VerifyPhoneNumberCodeResponseDto extends CommonDto {
  @ApiProperty({ type: UsersDto })
  @Type(() => UsersDto)
  user?: UsersDto;

  @ApiProperty()
  token?: string;
}

export class LoginBody {
  @ApiProperty()
  id: string;
}

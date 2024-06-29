import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';
import { CommonDto } from 'src/common/common.dto';

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
  @ApiProperty({ description: 'The user id' })
  userId?: string;

  @ApiProperty()
  token?: string;
}

export class LoginBody {
  @ApiProperty()
  id: string;
}

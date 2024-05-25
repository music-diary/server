import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

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

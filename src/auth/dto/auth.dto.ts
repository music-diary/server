import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class SendPhoneNumberCodeBody {
  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}

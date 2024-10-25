import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class VerifySponsorBodyDto {
  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CommonDto } from '@common/dto/common.dto';

export class OauthLoginBody {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  authCode: string;
}

export class OauthLoginResponseDto extends CommonDto {
  @ApiProperty({ description: 'The user id' })
  data: string;

  @ApiProperty()
  token?: string;
}

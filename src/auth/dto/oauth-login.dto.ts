import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonDto } from '@common/dto/common.dto';

export class OauthLoginBody {
  @ApiProperty()
  @IsString()
  idToken: string;
}

export class OauthLoginResponseDto extends CommonDto {
  @ApiProperty({ description: 'The user id' })
  data: string;

  @ApiProperty()
  token?: string;
}

import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonDto } from 'src/common/common.dto';
import { AuthService } from './auth.service';
import {
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: SendPhoneNumberCodeBody,
    examples: { 'example-KR': { value: { phoneNumber: '+8201012345678' } } },
  })
  @ApiResponse({ status: HttpStatus.OK, type: CommonDto })
  @Post('phone')
  sendPhoneNumberCode(
    @Body() body: SendPhoneNumberCodeBody,
  ): Promise<CommonDto> {
    return this.authService.sendPhoneNumberCode(body);
  }

  @ApiBody({ type: VerifyPhoneNumberCodeBody })
  @ApiResponse({ status: HttpStatus.OK, type: CommonDto })
  @Post('phone/verification')
  verifyPhoneNumberCode(
    @Body() body: VerifyPhoneNumberCodeBody,
  ): Promise<CommonDto> {
    return this.authService.verifyPhoneNumberCode(body);
  }
}

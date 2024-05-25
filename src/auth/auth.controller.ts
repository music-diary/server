import { Body, Controller, Post } from '@nestjs/common';
import { CommonDto } from 'src/common/common.dto';
import { AuthService } from './auth.service';
import { SendPhoneNumberCodeBody } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('phone')
  sendPhoneNumberCode(
    @Body() body: SendPhoneNumberCodeBody,
  ): Promise<CommonDto> {
    return this.authService.sendPhoneNumberCode(body);
  }
}

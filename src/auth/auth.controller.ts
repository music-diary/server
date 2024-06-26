import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommonDto } from 'src/common/common.dto';
import { AuthService } from './auth.service';
import {
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
} from './dto/auth.dto';
import { SignUpBody } from './dto/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Send phone number verification code' })
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

  @ApiOperation({ summary: 'Verify phone number verification code' })
  @ApiBody({ type: VerifyPhoneNumberCodeBody })
  @ApiResponse({ status: HttpStatus.OK, type: CommonDto })
  @Post('phone/verification')
  async verifyPhoneNumberCode(
    @Body() body: VerifyPhoneNumberCodeBody,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.verifyPhoneNumberCode(body);
    const { token, ...data } = result;
    return token
      ? response.header('Authorization', `Bearer ${token}`).send(data)
      : response.send(data);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpBody })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CommonDto,
    headers: {
      Authorization: {
        description: 'The access token',
        schema: {
          type: 'string',
          example: 'Bearer <jwt-token>',
        },
      },
    },
  })
  @Post('sign-up')
  async signUp(
    @Body() body: SignUpBody,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.create(body);
    const { token, ...data } = result;
    response.header('Authorization', `Bearer ${token}`);
    response.send(data);
    return;
  }
}

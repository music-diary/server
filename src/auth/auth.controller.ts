import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommonDto } from 'src/common/common.dto';
import { AuthService } from './auth.service';
import {
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
} from './dto/auth.dto';
import { LoginBody } from './dto/login.dto';
import { SignUpBody, SignUpResponseDto } from './dto/sign-up.dto';

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

  @ApiBody({ type: SignUpBody })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SignUpResponseDto,
    headers: {
      Authorization: {
        description: 'The access token',
        schema: {
          type: 'string',
          example: 'access-token=<jwt-token>',
        },
      },
    },
  })
  @Post('sign-up')
  async signUp(
    @Body() body: LoginBody,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authService.create(body);
    const { token, ...data } = result;
    response.header('Authorization', `access-token=Bearer ${token}`);
    response.send(data);
    return;
  }

  @ApiBody({ type: LoginBody })
  @ApiResponse({ status: HttpStatus.OK, type: CommonDto })
  @Post('login')
  async login(
    @Body() body: LoginBody,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authService.login(body);
    const { token, ...data } = result;
    response.setHeader('Authorization', `access-token=Bearer ${token}`);
    response.send(data);
    return;
  }
}

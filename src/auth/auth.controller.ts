import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import {
  LoginBody,
  SendPhoneNumberCodeBody,
  VerifyPhoneNumberCodeBody,
} from './dto/auth.dto';
import { SignUpBody, SignUpResponseDto } from './dto/sign-up.dto';
import { CommonDto } from '@common/dto/common.dto';
import { OauthLoginBody } from './dto/oauth-login.dto';
import { AppleAuthGuard, GoogleAuthGuard } from '@common/guards/oauth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Send phone number verification code' })
  @ApiBody({
    type: SendPhoneNumberCodeBody,
    examples: { example: { value: { phoneNumber: '+821012345678' } } },
  })
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
    type: SignUpResponseDto,
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

  // NOTE: This is a temporary implementation for the test.
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
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
  @Post('login')
  async login(
    @Body() body: LoginBody,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.login(body);
    const { token, ...data } = result;
    response.header('Authorization', `Bearer ${token}`);
    response.send(data);
    return;
  }

  @ApiOperation({ summary: 'Oauth Login' })
  @ApiResponse({
    status: HttpStatus.OK,
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
  @Post('login/oauth')
  async oauthLogin(
    @Body() body: OauthLoginBody,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.oauthLogin(body);
    const { token, ...data } = result;
    response.header('Authorization', `Bearer ${token}`);
    response.send(data);
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Post('login/oauth/google')
  async googleLogin(
    @Body() body: OauthLoginBody,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.oauthLogin(body);
    const { token, ...data } = result;
    response.header('Authorization', `Bearer ${token}`);
    response.send(data);
    return;
  }

  @UseGuards(AppleAuthGuard)
  @Post('login/oauth/apple')
  async appleLogin(
    @Body() body: OauthLoginBody,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.authService.oauthLogin(body);
    const { token, ...data } = result;
    response.header('Authorization', `Bearer ${token}`);
    response.send(data);
    return;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req) {
    // Handle successful Google authentication
    return this.authService.login(req.user);
  }

  @Get('apple')
  @UseGuards(AppleAuthGuard)
  async appleAuth() {
    // Guard will redirect to Apple
  }

  @Get('apple/callback')
  @UseGuards(AppleAuthGuard)
  async appleAuthCallback(@Req() req) {
    // Handle successful Apple authentication
    return this.authService.login(req.user);
  }
}

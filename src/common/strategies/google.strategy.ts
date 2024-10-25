import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { ProviderTypes } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(
  Strategy,
  'google-token',
) {
  private googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super();
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  async validate(req: any): Promise<any> {
    const token = req.body.idToken;

    try {
      // Google ID 토큰 검증
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      console.log('google ticket:', ticket);

      const payload = ticket.getPayload();
      console.log('google payload:', payload);

      // 사용자 정보 검증 및 저장
      const user = await this.authService.validateOAuthLogin(
        {
          email: payload.email,
          name: payload.name ?? undefined,
          firstName: payload.given_name ?? undefined,
          lastName: payload.family_name ?? undefined,
          provideId: payload.sub,
        },
        ProviderTypes.GOOGLE,
      );
      console.log('google user:', user);
      return user;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}

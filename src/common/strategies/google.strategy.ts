import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { ProviderTypes } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { Strategy } from 'passport-custom';
import { OauthPayLoad } from '@auth/types/oauth.type';

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

  async validate(req: any): Promise<OauthPayLoad> {
    const token = req.body.idToken;
    if (!token) {
      throw new UnauthorizedException('Google token not found');
    }

    try {
      // Google ID 토큰 검증
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      console.debug('google payload:', payload);

      return {
        id: payload.sub,
        email: payload.email,
        providerType: ProviderTypes.GOOGLE,
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { ProviderTypes } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL') ?? '',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    try {
      const { id, name, emails } = profile;
      const user = {
        id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        accessToken,
        refreshToken,
      };

      // 사용자 정보 저장 또는 업데이트
      const savedUser = await this.authService.validateOAuthLogin(
        user,
        ProviderTypes.GOOGLE,
      );
      return savedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

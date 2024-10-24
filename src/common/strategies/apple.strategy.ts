import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { ProviderTypes } from '@prisma/client';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('APPLE_CLIENT_ID'),
      teamID: configService.get('APPLE_TEAM_ID'),
      keyID: configService.get('APPLE_KEY_ID'),
      keyFilePath: configService.get('APPLE_PRIVATE_KEY_PATH'),
      callbackURL: configService.get('APPLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['email', 'name'],
      authorizationURL: undefined,
      tokenURL: undefined,
    });
  }

  async validate(req: any, accessToken: string, idToken: any): Promise<any> {
    // Apple은 첫 로그인 시에만 이메일과 이름을 제공
    const email = idToken.email;
    const sub = idToken.sub;
    const firstName = req.body?.firstName;
    const lastName = req.body?.lastName;

    const user = {
      email,
      name: firstName + lastName,
      accessToken,
    };

    const savedUser = await this.authService.validateOAuthLogin(
      user,
      ProviderTypes.APPLE,
    );
    return savedUser;
  }
}

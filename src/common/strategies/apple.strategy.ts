import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { ProviderTypes } from '@prisma/client';
import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { OauthPayLoad } from '@auth/types/oauth.type';

@Injectable()
export class AppleTokenStrategy extends PassportStrategy(
  Strategy,
  'apple-token',
) {
  private jwksClient: JwksClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super();
    this.jwksClient = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
      cache: true,
      rateLimit: true,
    });
  }

  async validate(req: any): Promise<OauthPayLoad> {
    const idToken = req.body.idToken;
    if (!idToken) {
      throw new UnauthorizedException('Apple token not found');
    }

    try {
      const decoded = await this.verifyAppleToken(idToken);
      return decoded;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Apple authentication failed');
    }
  }

  async verifyAppleToken(idToken: string): Promise<OauthPayLoad> {
    const decodedHeader = jwt.decode(idToken, { complete: true })?.header;
    console.debug('apple decodedHeader:', decodedHeader);

    if (!decodedHeader || !decodedHeader.kid) {
      throw new UnauthorizedException('Invalid token header');
    }
    const signingKey = await this.jwksClient.getSigningKey(decodedHeader.kid);
    const publicKey = signingKey.getPublicKey();

    // 토큰 검증
    const payload = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      audience: this.configService.get<string>('APPLE_CLIENT_ID'),
      issuer: 'https://appleid.apple.com',
    }) as jwt.JwtPayload;

    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }
    console.debug('apple payload:', payload);

    return {
      id: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      providerType: ProviderTypes.APPLE,
    };
  }
}

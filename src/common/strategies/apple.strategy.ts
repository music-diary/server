import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { ProviderTypes } from '@prisma/client';
import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';

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

  async validate(req: any): Promise<any> {
    console.log('apple req:', req.body);
    const idToken = req.body.idToken;
    const user = req.body.user;
    if (!idToken) {
      throw new UnauthorizedException('Apple token not found');
    }

    try {
      // ID 토큰 검증
      const decoded = await this.verifyAppleToken(idToken);
      console.log('apple decoded:', decoded);

      // 사용자 정보 검증 및 저장
      // const user = await this.authService.validateOAuthUser(
      //   {
      //     email: decoded.email,
      //     providerId: decoded.id,
      //   },
      //   ProviderTypes.APPLE,
      // );
      // console.log('apple user:', user);

      return decoded;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Apple authentication failed');
    }
  }

  async verifyAppleToken(idToken: string) {
    const decodedHeader = jwt.decode(idToken, { complete: true })?.header;
    console.log('apple decodedHeader:', decodedHeader);

    if (!decodedHeader || !decodedHeader.kid) {
      throw new UnauthorizedException('Invalid token header');
    }
    const signingKey = await this.jwksClient.getSigningKey(decodedHeader.kid);
    const publicKey = signingKey.getPublicKey();
    console.log('apple signingKey:', signingKey);

    // 토큰 검증
    const payload = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      audience: this.configService.get<string>('APPLE_CLIENT_ID'),
      issuer: 'https://appleid.apple.com',
    }) as jwt.JwtPayload;

    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }
    console.log('apple payload:', payload);

    return {
      id: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      providerType: ProviderTypes.APPLE,
    };
  }
}

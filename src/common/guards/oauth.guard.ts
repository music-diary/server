import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google-token') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const activate = (await super.canActivate(context)) as boolean;
      return activate;
    } catch (error) {
      console.error('GoogleAuthGuard error:', error);
      return false;
    }
  }
}

@Injectable()
export class AppleAuthGuard extends AuthGuard('apple-token') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const activate = (await super.canActivate(context)) as boolean;
      return activate;
    } catch (error) {
      console.error('AppleAuthGuard error:', error);
      return false;
    }
  }
}

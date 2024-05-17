import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/common/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const handler = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    LoggerService.verbose(`${method} ${url}`, `${className}.${handler}`);
    return next.handle();
  }
}

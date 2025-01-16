import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LogService } from '@common/log.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const handler = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    LogService.verbose(`${method} ${url}`, `${className}.${handler}`);
    return next.handle();
  }
}

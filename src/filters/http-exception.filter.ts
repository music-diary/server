import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/common/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new LoggerService();
  constructor() {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const _request = context.getRequest<Request>();
    const exceptionName = exception.name;
    const status = exception.getStatus();
    const stack = exception.stack;

    this.logger.error(`${stack}`, `${exceptionName}`);
    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}

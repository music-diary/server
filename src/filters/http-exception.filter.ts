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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const _request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const stack = exception.stack;

    this.logger.error(`[${_request.method}] ${_request.url} ${status}`, stack);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}

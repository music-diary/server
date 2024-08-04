import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogService } from '@common/log.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new LogService();
  constructor() {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const _request = context.getRequest<Request>();

    const exceptionName = exception?.name;
    const exceptionMessage = exception.getResponse()['message'];
    const status = exception?.getStatus();
    const stack = exception?.stack;

    this.logger.error(`${exceptionMessage}\n${stack}`, exceptionName);
    response.status(status).json({
      statusCode: status,
      message: exceptionMessage,
      error: exceptionName,
    });
  }
}

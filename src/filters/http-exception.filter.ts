import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogService } from 'src/common/log.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new LogService();
  constructor() {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const _request = context.getRequest<Request>();
    const exceptionResponse = exception.getResponse();

    const exceptionName = exceptionResponse['error'];
    const exceptionMessage = exceptionResponse['message'];
    const status = exception.getStatus();
    const stack = exception.stack;

    this.logger.error(`${exceptionMessage} ${stack}`, `${exceptionName}`);
    response.status(status).json({
      statusCode: status,
      message: exceptionMessage,
      error: exceptionName,
    });
  }
}

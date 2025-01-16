import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { LogService } from '@common/log.service';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new LogService();
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const _request = context.getRequest<Request>();

    const exceptionName = exception?.name;
    const exceptionMessage = exception?.message;
    const stack = exception?.stack;
    this.logger.error(`${exceptionMessage}\n${stack}`, exceptionName);

    if (exception.code === 'P2002') {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: exceptionMessage,
        error: exceptionName,
      });
    } else {
      const code = HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(code).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exceptionMessage,
        error: exceptionName,
      });
    }
  }
}

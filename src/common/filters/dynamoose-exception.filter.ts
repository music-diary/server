import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';

@Catch(DynamoDBServiceException)
export class DynamoDBExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DynamoDBExceptionFilter.name);
  catch(exception: DynamoDBServiceException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const statusCode =
      exception.$metadata.httpStatusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception.message || 'An error occurred from DynamoDB service.';

    this.logger.error(exception.message, exception.stack);
    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      error: exception.stack,
    });
  }
}

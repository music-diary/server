import { ConsoleLogger, Injectable } from '@nestjs/common';
import { createLogger } from 'winston';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logger: any;
  constructor() {
    super();
    this.logger = createLogger();
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.log(message, optionalParams);
  }
  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams);
  }
  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams);
  }
  fatal(message: any, ...optionalParams: any[]) {
    this.logger.log(message, optionalParams);
  }
}

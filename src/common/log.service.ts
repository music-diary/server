import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogService extends Logger {
  private readonly logger: any;
  constructor() {
    super();
    this.logger = new Logger();
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

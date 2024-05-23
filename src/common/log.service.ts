import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogService extends Logger {
  private readonly logger: Logger;
  constructor() {
    super();
    this.logger = new Logger();
  }

  log(message: any, context: string) {
    this.logger.log(message, context);
  }

  error(message: any, context: string) {
    this.logger.error(message, context);
  }

  debug(message: any, context: string) {
    this.logger.debug(message, context);
  }

  verbose(message: any, context: string) {
    this.logger.verbose(message, context);
  }

  warn(message: any, context: string) {
    this.logger.warn(message, context);
  }
}

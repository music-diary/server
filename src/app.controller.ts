import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CommonDto } from './common/common.dto';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  health(): CommonDto {
    return {
      statusCode: HttpStatus.OK,
      message: 'Service is up and running!',
    };
  }
}

import { CommonDto } from '@common/dto/common.dto';
import { Controller, Get, HttpStatus } from '@nestjs/common';

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

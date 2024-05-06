import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonDto } from './common/common.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health(): CommonDto {
    return this.appService.health();
  }
}

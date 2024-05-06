import { HttpStatus, Injectable } from '@nestjs/common';
import { CommonDto } from './common/common.dto';

@Injectable()
export class AppService {
  health(): CommonDto {
    return {
      statusCode: HttpStatus.OK,
      message: 'Service is up and running!',
    };
  }
}

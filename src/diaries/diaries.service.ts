import { HttpStatus, Injectable } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { FindEmotionsResponseDto } from './dto/find.emotions.dto';
import { EmotionsRepository } from './emotions.repository';

@Injectable()
export class DiariesService {
  constructor(
    private readonly emotionsRepository: EmotionsRepository,
    private readonly logService: LogService,
  ) {}

  async getEmotions(): Promise<FindEmotionsResponseDto> {
    const emotions = await this.emotionsRepository.findAll();
    this.logService.verbose(`Get all emotions`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      emotions,
    };
  }
}

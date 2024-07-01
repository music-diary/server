import { HttpStatus, Injectable } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { FindEmotionsResponseDto } from './dto/find.emotions.dto';
import { FindTemplatesResponseDto } from './dto/find.templates.dto';
import { FindTopicsResponseDto } from './dto/find.topics.dto';
import { EmotionsRepository } from './repository/emotions.repository';
import { TemplatesRepository } from './repository/templates.repository';
import { TopicsRepository } from './repository/topics.repository';

@Injectable()
export class DiariesService {
  constructor(
    private readonly emotionsRepository: EmotionsRepository,
    private readonly topicsRepository: TopicsRepository,
    private readonly templatesRepository: TemplatesRepository,
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

  async getTopics(): Promise<FindTopicsResponseDto> {
    const topics = await this.topicsRepository.findAll();
    this.logService.verbose(`Get all topics`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      topics,
    };
  }

  async getTemplates(): Promise<FindTemplatesResponseDto> {
    const templates = await this.templatesRepository.findAll();
    this.logService.verbose(`Get all templates`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      templates,
    };
  }
}

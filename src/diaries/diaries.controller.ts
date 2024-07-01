import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiariesService } from './diaries.service';
import { FindEmotionsResponseDto } from './dto/find.emotions.dto';
import { FindTopicsResponseDto } from './dto/find.topics.dto';
import { FindTemplatesResponseDto } from './dto/find.templates.dto';

@ApiTags('Diaries')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @ApiOperation({ summary: 'Get all emotions' })
  @Get('emotions')
  getEmotions(): Promise<FindEmotionsResponseDto> {
    return this.diariesService.getEmotions();
  }

  @ApiOperation({ summary: 'Get all topics' })
  @Get('topics')
  getTopics(): Promise<FindTopicsResponseDto> {
    return this.diariesService.getTopics();
  }

  @ApiOperation({ summary: 'Get all templates' })
  @Get('templates')
  getTemplates(): Promise<FindTemplatesResponseDto> {
    return this.diariesService.getTemplates();
  }
}

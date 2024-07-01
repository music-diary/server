import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiariesService } from './diaries.service';
import { FindEmotionsResponseDto } from './dto/find.emotions.dto';

@ApiTags('Diaries')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @ApiOperation({ summary: 'Get all emotions' })
  @Get('emotions')
  getEmotions(): Promise<FindEmotionsResponseDto> {
    return this.diariesService.getEmotions();
  }
}

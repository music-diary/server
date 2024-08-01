import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserPayload } from 'src/users/dto/user.dto';
import { DiariesService } from './diaries.service';
import {
  CreateDiaryBodyDto,
  CreateDiaryResponseDto,
} from './dto/create.diary.dto';
import {
  FindDiariesResponseDto,
  FindDiaryResponseDto,
  GetDiariesQueryDto,
} from './dto/find.diary.dto';
import { FindEmotionsResponseDto } from './dto/find.emotions.dto';
import { FindTemplatesResponseDto } from './dto/find.templates.dto';
import { FindTopicsResponseDto } from './dto/find.topics.dto';
import {
  UpdateDiaryBodyDto,
  UpdateDiaryResponseDto,
} from './dto/update.diary.dto';
import { CommonDto } from 'src/common/common.dto';
import { RecommendMusicResponseDto } from './dto/recommand-music.dto';
import { DiariesStatus } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';

@ApiTags('Diaries')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @ApiOperation({ summary: 'Get all emotions' })
  @ApiQuery({ name: 'name', required: false })
  @Get('emotions')
  getEmotions(@Query('name') name?: string): Promise<FindEmotionsResponseDto> {
    return this.diariesService.getEmotions(name);
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

  @ApiOperation({ summary: 'Get my diaries archive' })
  @ApiQuery({ name: 'start-at', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'end-at', required: false, example: '2024-01-31' })
  @ApiQuery({ name: 'group', required: false, example: 'month' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me/archive')
  getDiariesArchive(
    @User() user: UserPayload,
    @Query('start-at') startAt?: string,
    @Query('end-at') endAt?: string,
    @Query('group') group?: string,
  ): Promise<FindDiariesResponseDto> {
    return this.diariesService.getDiariesArchive(
      user.id,
      startAt,
      endAt,
      group,
    );
  }

  @ApiOperation({ summary: 'Get all diaries' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  getDiaries(
    @User() user: UserPayload,
    @Query() query?: GetDiariesQueryDto,
  ): Promise<FindDiariesResponseDto> {
    return this.diariesService.getDiaries(user.id, query);
  }

  @ApiOperation({ summary: 'Get one diary' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  getDiary(
    @Param('id') id: string,
    @User() user: UserPayload,
  ): Promise<FindDiaryResponseDto> {
    return this.diariesService.getDiary(id, user.id);
  }

  @ApiOperation({ summary: 'Create diary' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(
    @User() user: UserPayload,
    @Body() body: CreateDiaryBodyDto,
  ): Promise<CreateDiaryResponseDto> {
    return this.diariesService.create(user.id, body);
  }

  @ApiOperation({ summary: 'Request AI music recommendation' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id/musics/ai')
  recommendMusics(
    @User() user: UserPayload,
    @Param('id') id: string,
  ): Promise<RecommendMusicResponseDto> {
    return this.diariesService.recommendMusics(user.id, id);
  }

  @ApiOperation({ summary: 'Update diary' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: UserPayload,
    @Body() body: UpdateDiaryBodyDto,
  ): Promise<UpdateDiaryResponseDto> {
    return this.diariesService.update(id, user.id, body);
  }

  @ApiOperation({ summary: 'Delete diary' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @User() user: UserPayload,
  ): Promise<CommonDto> {
    return this.diariesService.delete(id, user.id);
  }
}

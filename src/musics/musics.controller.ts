import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { MusicsService } from './musics.service';
import { User } from 'src/decorator/user.decorator';
import { UserPayload } from 'src/users/dto/user.dto';
import {
  FindAllMusicsArchiveResponse,
  FindAllMusicsResponse,
  FindMusicsArchiveSummaryResponse,
  FindMusicsModelResponse,
} from './dto/find-music.dto';
import { CreateDiaryMusicBodyDto } from './dto/create-music.dto';
import { CommonDto } from 'src/common/common.dto';

@ApiTags('Musics')
@Controller('musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @ApiOperation({ summary: 'Get all musics archives' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me/archive')
  getMusicsArchive(
    @User() user: UserPayload,
    @Query('start-at') startAt?: string,
    @Query('end-at') endAt?: string,
    @Query('group') group?: string,
  ): Promise<FindAllMusicsArchiveResponse> {
    return this.musicsService.getMusicsArchive(user.id, startAt, endAt, group);
  }

  @ApiOperation({ summary: '(AI) Get musics by title or songId' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'songId', required: false })
  @Get()
  getMusics(
    @Query('title') title?: string,
    @Query('songId') songId?: string,
  ): Promise<FindMusicsModelResponse> {
    return this.musicsService.getMusics(title, songId);
  }

  @ApiOperation({ summary: '(AI) Generate music candidates' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateDiaryMusicBodyDto })
  @UseGuards(AuthGuard)
  @Post('candidates')
  createMusicCandidates(
    @User() user: UserPayload,
    @Body() body: CreateDiaryMusicBodyDto,
  ): Promise<CommonDto> {
    return this.musicsService.createMusicCandidates(user.id, body);
  }

  @ApiOperation({ summary: '(AI) Get musics candidates' })
  @ApiBody({ type: FindAllMusicsResponse })
  @Get('candidates/:diaryId')
  getMusicCandidatesByDiary(
    @Param('diaryId') diaryId: string,
  ): Promise<FindAllMusicsResponse> {
    return this.musicsService.getMusicCandidatesByDiary(diaryId);
  }

  @ApiOperation({ summary: 'Get all musics archive summary' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me/archive/summary')
  getMusicsArchiveSummary(
    @User() user: UserPayload,
  ): Promise<FindMusicsArchiveSummaryResponse> {
    return this.musicsService.getMusicsArchiveSummary(user.id);
  }
}

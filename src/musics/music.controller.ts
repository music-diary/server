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
import { MusicService } from './music.service';
import {
  FindAllMusicsArchiveResponse,
  FindAllMusicsResponse,
  FindMusicsArchiveSummaryResponse,
  FindMusicsModelResponse,
} from './dto/find-music.dto';
import { CreateDiaryMusicBodyDto } from './dto/create-music.dto';
import { CommonDto } from '@common/dto/common.dto';
import { AuthGuard } from '@common/guards/auth.guard';
import { User } from '@common/decorator/user.decorator';
import { UserPayload } from '@user/dto/user.dto';

@ApiTags('Musics')
@Controller('musics')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

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
    return this.musicService.getMusicsArchive(user.id, startAt, endAt, group);
  }

  @ApiOperation({ summary: '(AI) Get musics by title or songId' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'songId', required: false })
  @Get()
  getMusics(
    @Query('title') title?: string,
    @Query('songId') songId?: string,
  ): Promise<FindMusicsModelResponse> {
    return this.musicService.getMusics(title, songId);
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
    return this.musicService.createMusicCandidates(user.id, body);
  }

  @ApiOperation({ summary: '(AI) Get musics candidates' })
  @ApiBody({ type: FindAllMusicsResponse })
  @Get('candidates/:diaryId')
  getMusicCandidatesByDiary(
    @Param('diaryId') diaryId: string,
  ): Promise<FindAllMusicsResponse> {
    return this.musicService.getMusicCandidatesByDiary(diaryId);
  }

  @ApiOperation({ summary: 'Get all musics archive summary' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me/archive/summary')
  getMusicsArchiveSummary(
    @User() user: UserPayload,
  ): Promise<FindMusicsArchiveSummaryResponse> {
    return this.musicService.getMusicsArchiveSummary(user.id);
  }
}

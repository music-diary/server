import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { MusicsService } from './musics.service';
import { User } from 'src/decorator/user.decorator';
import { UserPayload } from 'src/users/dto/user.dto';
import { FindAllMusicsResponse } from './dto/find-music.dto';

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
  ): Promise<FindAllMusicsResponse> {
    return this.musicsService.getMusicsArchive(user.id, startAt, endAt);
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { MusicsRepository } from './musics.repository';
import { LogService } from 'src/common/log.service';
import { FindAllMusicsResponse, FindMusicResponse } from './dto/find-music.dto';
import { Prisma } from '@prisma/client';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { MusicKey, MusicModel } from './schema/music.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MusicsService {
  constructor(
    @InjectModel('Music')
    private readonly model: Model<MusicModel, MusicKey>,
    private readonly musicsRepository: MusicsRepository,
    private readonly logService: LogService,
  ) {}

  async getMusicsArchive(
    userId: string,
    startAt?: string,
    endAt?: string,
  ): Promise<FindAllMusicsResponse> {
    const endDate = new Date(endAt).setDate(new Date(endAt).getDate() + 1);
    const findQuery: Prisma.MusicsFindManyArgs = {
      where: {
        userId,
        createdAt: {
          lte: endAt ? new Date(endDate).toISOString() : undefined,
          gte: startAt ? new Date(startAt).toISOString() : undefined,
        },
      },
      include: {
        diary: {
          select: {
            id: true,
          },
        },
      },
    };
    const musics = await this.musicsRepository.findAll(findQuery);
    this.logService.verbose(
      `Get all musics archives from ${startAt} to ${endAt}`,
      MusicsService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all diaries archives',
      musics,
    };
  }

  async getMusicByTitle(title: string): Promise<FindMusicResponse> {
    const music = await this.model.get({ title });
    this.logService.verbose(`Get music by title: ${title}`, MusicsService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get music by title',
      music,
    };
  }
}

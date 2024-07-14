import { HttpStatus, Injectable } from '@nestjs/common';
import { MusicsRepository } from './musics.repository';
import { LogService } from 'src/common/log.service';
import { FindAllMusicsResponse, FindMusicResponse } from './dto/find-music.dto';
import { Prisma } from '@prisma/client';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { MusicKey, MusicModel } from './schema/music.type';
import { CreateDiaryMusicBodyDto } from './dto/create-music.dto';
import { DiariesRepository } from 'src/diaries/repository/diaires.repository';
import { CommonDto } from 'src/common/common.dto';

@Injectable()
export class MusicsService {
  constructor(
    @InjectModel('Music')
    private readonly model: Model<MusicModel, MusicKey>,
    private readonly musicsRepository: MusicsRepository,
    private readonly diariesRepository: DiariesRepository,
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
            emotions: {
              select: {
                emotions: true,
              },
            },
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

  async createDiaryMusics(
    userId: string,
    body: CreateDiaryMusicBodyDto,
  ): Promise<CommonDto> {
    const { diaryId, musics } = body;
    const diary = await this.diariesRepository.findUniqueOne({
      where: { id: diaryId },
    });
    musics.map(async (music) => {
      const candidatedMusic = await this.model.get({ title: music.title });
      const updateMusicInfo = {
        songId: candidatedMusic.songId,
        title: candidatedMusic.title,
        albumUrl: candidatedMusic.albumUrl,
        artist: candidatedMusic.artist,
        lyric: candidatedMusic.lyric,
        originalGenre: candidatedMusic.genre,
        diaryId: diary.id,
        userId,
      };
      await this.musicsRepository.createMany({ data: updateMusicInfo });
    });

    this.logService.verbose(
      `Create Diary musics by user - ${userId}, diary - ${diaryId}`,
      MusicsService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Create Diary musics',
    };
  }

  async getMusicCandidatesByDiary(
    diaryId: string,
  ): Promise<FindAllMusicsResponse> {
    const findQuery: Prisma.MusicsFindManyArgs = {
      where: {
        diaryId,
      },
      include: {
        diary: {
          select: {
            emotions: true,
          },
        },
      },
    };
    const musics = await this.musicsRepository.findAll(findQuery);
    this.logService.verbose(
      `Get music Candidates by diaryId: ${diaryId}`,
      MusicsService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get music by diaryId',
      musics,
    };
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { MusicRepository } from './music.repository';
import { LogService } from 'src/common/log.service';
import {
  FindAllMusicsArchiveResponse,
  FindAllMusicsResponse,
  FindMusicsArchiveSummaryResponse,
  FindMusicsModelResponse,
} from './dto/find-music.dto';
import { DiariesStatus, Prisma } from '@prisma/client';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { MusicKey, MusicModel } from './schema/music.type';
import { CreateDiaryMusicBodyDto } from './dto/create-music.dto';
import { DiaryRepository } from 'src/diaries/repository/diairy.repository';
import { CommonDto } from 'src/common/common.dto';
import { PrismaService } from 'src/database/prisma.service';
import { EmotionsRepository } from '../diaries/repository/emotion.repository';
import { Condition } from 'dynamoose';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel('Music')
    private readonly model: Model<MusicModel, MusicKey>,
    private readonly musicRepository: MusicRepository,
    private readonly diariesRepository: DiaryRepository,
    private readonly emotionsRepository: EmotionsRepository,
    private readonly prismaService: PrismaService,
    private readonly logService: LogService,
  ) {}

  async getMusicsArchive(
    userId: string,
    startAt?: string,
    endAt?: string,
    group?: string,
  ): Promise<FindAllMusicsArchiveResponse> {
    const data = {};
    const startDate = new Date(startAt).toISOString();
    const endDate = new Date(
      new Date(endAt).setDate(new Date(endAt).getDate() + 1),
    ).toISOString();
    const findQuery: Prisma.MusicsFindManyArgs = {
      where: { userId, createdAt: { gte: startDate, lt: endDate } },
      include: {
        diary: {
          where: { userId, status: DiariesStatus.DONE },
          select: {
            emotions: {
              select: {
                emotions: { select: { parent: { include: { parent: true } } } },
              },
            },
          },
        },
      },
    };
    if (startAt) {
      findQuery.where.createdAt = {
        gte: startDate,
      };
    }
    if (endAt) {
      findQuery.where.createdAt = {
        lte: endDate,
      };
    }
    const musics = await this.musicRepository.findMany(findQuery);
    data['musics'] = musics;

    if (group) {
      data['count'] = await this.getDiariesCount(userId, startDate, endDate);
      data['emotion'] = await this.getMostEmotion(userId, startDate, endDate);
    }

    this.logService.verbose(
      `Get all musics archives from ${startAt} to ${endAt}`,
      MusicService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all diaries archives',
      data,
    };
  }

  async getMusics(
    title?: string,
    songId?: string,
  ): Promise<FindMusicsModelResponse> {
    const conditions = new Condition();
    if (title) {
      conditions.filter('title').contains(title);
    }
    if (songId) {
      conditions.filter('songId').contains(songId);
    }
    const musics: MusicModel[] =
      !title && !songId
        ? await this.model.scan().limit(20).exec()
        : await this.model.scan(conditions).all().exec();
    this.logService.verbose(`Get musics ${title} ${songId}`, MusicService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get musics',
      musics,
    };
  }

  async createMusicCandidates(
    userId: string,
    body: CreateDiaryMusicBodyDto,
  ): Promise<CommonDto> {
    const { diaryId, musics } = body;
    const diary = await this.diariesRepository.findUniqueOne({
      where: { id: diaryId },
    });
    musics.map(async (music) => {
      const candidatedMusic = await this.model
        .query('songId')
        .eq(music.songId)
        .exec()[0];
      const updateMusicInfo = {
        songId: candidatedMusic.songId,
        title: candidatedMusic.title,
        albumUrl: candidatedMusic.albumUrl,
        artist: candidatedMusic.artist,
        lyric: candidatedMusic.lyric,
        originalGenre: candidatedMusic.genre,
        youtubeUrl: candidatedMusic.youtubeUrl ?? null,
        editorPick: candidatedMusic.editor_name ?? null,
        diaryId: diary.id,
        userId,
      };
      await this.musicRepository.createMany({ data: updateMusicInfo });
    });

    this.logService.verbose(
      `Create Diary musics by user - ${userId}, diary - ${diaryId}`,
      MusicService.name,
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
    const musics = await this.musicRepository.findMany(findQuery);
    this.logService.verbose(
      `Get music Candidates by diaryId: ${diaryId}`,
      MusicService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get music by diaryId',
      musics,
    };
  }

  async getMusicsArchiveSummary(
    userId: string,
  ): Promise<FindMusicsArchiveSummaryResponse> {
    const summary = await this.getMusicSummaryByMonth(userId);
    this.logService.verbose(
      `Get musics archive summary by user ${userId}`,
      MusicService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get musics archive summary',
      summary,
    };
  }

  private async getMusicSummaryByMonth(userId: string) {
    const months = await this.prismaService.musics.findMany({
      where: { userId },
      select: { createdAt: true },
    });
    const uniqueMonths = Array.from(
      new Set(
        months.map((month) => month.createdAt.toISOString().substring(0, 7)),
      ),
    );

    const statistics = await Promise.all(
      uniqueMonths.map(async (month) => {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const latestMusic = await this.musicRepository.findOne({
          where: {
            userId,
            createdAt: { gte: startDate, lt: endDate },
          },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            songId: true,
            title: true,
            artist: true,
            albumUrl: true,
          },
        });

        const musicCount = await this.prismaService.musics.count({
          where: { userId, createdAt: { gte: startDate, lt: endDate } },
        });

        const emotions = await this.prismaService.diaryEmotions.groupBy({
          by: ['emotionId'],
          where: {
            userId,
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          },
          _count: {
            emotionId: true,
          },
          orderBy: {
            _count: {
              emotionId: 'desc',
            },
          },
          take: 1,
        });

        const mostFrequentEmotion =
          emotions.length > 0
            ? await this.emotionsRepository.findUnique({
                where: {
                  id: emotions[0].emotionId,
                },
                select: {
                  parent: {
                    include: {
                      parent: true,
                    },
                  },
                },
              })
            : null;

        return {
          date: month,
          music: latestMusic,
          count: musicCount,
          emotion: mostFrequentEmotion,
        };
      }),
    );

    return statistics;
  }

  private async getDiariesCount(
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    return await this.prismaService.diaries.count({
      where: {
        userId,
        createdAt: { gte: startDate, lt: endDate },
        status: DiariesStatus.DONE,
      },
    });
  }

  private async getMostEmotion(
    userId: string,
    startDate: string,
    endDate: string,
  ) {
    const emotions = await this.prismaService.diaryEmotions.groupBy({
      by: ['emotionId'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _count: {
        emotionId: true,
      },
      orderBy: {
        _count: {
          emotionId: 'desc',
        },
      },
      take: 1,
    });

    const mostFrequentEmotion =
      emotions.length > 0
        ? await this.emotionsRepository.findUnique({
            where: {
              id: emotions[0].emotionId,
            },
            select: {
              parent: {
                include: {
                  parent: true,
                },
              },
            },
          })
        : null;

    return mostFrequentEmotion;
  }
}

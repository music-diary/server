import { HttpStatus, Injectable } from '@nestjs/common';
import { MusicRepository } from './music.repository';
import { LogService } from '@common/log.service';
import {
  FindAllMusicsArchiveResponse,
  FindAllMusicsResponse,
  FindMusicsArchiveSummaryResponse,
  FindMusicsModelResponse,
} from './dto/find-music.dto';
import { DiariesStatus, Prisma } from '@prisma/client';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { CreateDiaryMusicBodyDto } from './dto/create-music.dto';
import { CommonDto } from '@common/dto/common.dto';
import { PrismaService } from '@database/prisma/prisma.service';
import { EmotionsRepository } from '../diaries/repository/emotion.repository';
import { Condition } from 'dynamoose';
import { DiaryRepository } from '@diary/repository/diary.repository';
import { MusicAiKey, MusicAiModel } from './schema/music-ai.type';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel('MusicAiModel')
    private readonly model: Model<MusicAiModel, MusicAiKey>,
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
    const { startDate, endDate } = this.parseDateRange(startAt, endAt);
    const findTimeQuery = {
      where: {
        ...(startAt && { updatedAt: { gte: startDate } }),
        ...(endAt && { updatedAt: { lte: endDate } }),
        ...(startAt &&
          endAt && { updatedAt: { gte: startDate, lte: endDate } }),
      },
    };
    const findQuery: Prisma.MusicsFindManyArgs = {
      where: {
        userId,
        selected: true,
        deletedAt: null,
        ...findTimeQuery.where,
      },
      include: {
        diary: {
          where: {
            userId,
            status: DiariesStatus.DONE,
            deletedAt: null,
            ...findTimeQuery.where,
          },
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
      message: 'Get all musics archives',
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
    const musics: MusicAiModel[] =
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
      where: { userId, deletedAt: null },
      select: { updatedAt: true },
    });
    const uniqueMonths = Array.from(
      new Set(
        months.map((month) => month.updatedAt.toISOString().substring(0, 7)),
      ),
    );

    const statistics = await Promise.all(
      uniqueMonths.map(async (month) => {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const latestMusic = await this.musicRepository.findOne({
          where: {
            userId,
            selected: true,
            updatedAt: { gte: startDate, lt: endDate },
          },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            songId: true,
            title: true,
            artist: true,
            albumUrl: true,
            selected: true,
          },
        });

        const diaryCount = await this.prismaService.diaries.count({
          where: {
            userId,
            status: DiariesStatus.DONE,
            updatedAt: { gte: startDate, lt: endDate },
          },
        });

        const emotions = await this.prismaService.diaryEmotions.groupBy({
          by: ['emotionId'],
          where: {
            userId,
            updatedAt: {
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
          count: diaryCount,
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
        createdAt: { gte: startDate, lte: endDate },
        deletedAt: null,
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
          lte: endDate,
        },
        diary: {
          status: DiariesStatus.DONE,
          deletedAt: null,
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

  private parseDateRange(
    startAt?: string,
    endAt?: string,
  ): { startDate: string; endDate: string } {
    const startDate = startAt ? new Date(startAt).toISOString() : null;
    const endDate = endAt ? new Date(endAt).toISOString() : null;
    return { startDate, endDate };
  }
}

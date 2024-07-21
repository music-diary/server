import { HttpStatus, Injectable } from '@nestjs/common';
import { MusicsRepository } from './musics.repository';
import { LogService } from 'src/common/log.service';
import {
  FindAllMusicsResponse,
  FindMusicsArchiveResponse,
  FindMusicsModelResponse,
} from './dto/find-music.dto';
import { Prisma, DiaryEmotions } from '@prisma/client';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { MusicKey, MusicModel } from './schema/music.type';
import { CreateDiaryMusicBodyDto } from './dto/create-music.dto';
import { DiariesRepository } from 'src/diaries/repository/diaires.repository';
import { CommonDto } from 'src/common/common.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MusicsService {
  constructor(
    @InjectModel('Music')
    private readonly model: Model<MusicModel, MusicKey>,
    private readonly musicsRepository: MusicsRepository,
    private readonly diariesRepository: DiariesRepository,
    private readonly prismaService: PrismaService,
    private readonly logService: LogService,
  ) {}

  async getMusicsArchive(
    userId: string,
    startAt?: string,
    endAt?: string,
  ): Promise<FindAllMusicsResponse> {
    const endDate = new Date(endAt).setDate(new Date(endAt).getDate() + 1);
    const findQuery: Prisma.MusicsFindManyArgs = {
      where: { userId },
      include: {
        diary: {
          include: {
            emotions: {
              select: {
                emotions: {
                  include: {
                    parent: {
                      include: {
                        parent: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    if (startAt) {
      findQuery.where.createdAt = {
        gte: new Date(startAt).toISOString(),
      };
    }
    if (endAt) {
      findQuery.where.createdAt = {
        lte: new Date(endDate).toISOString(),
      };
    }
    const musics = await this.musicsRepository.findMany(findQuery);
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

  async getMusics(title?: string): Promise<FindMusicsModelResponse> {
    const musics: MusicModel[] = title
      ? await this.model.scan('title').contains(title).exec()
      : await this.model.scan().limit(20).exec();
    this.logService.verbose(`Get musics`, MusicsService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get musics',
      musics,
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
    const musics = await this.musicsRepository.findMany(findQuery);
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

  async getMusicsArchiveSummary(
    userId: string,
  ): Promise<FindMusicsArchiveResponse> {
    const musicCount = await this.prismaService.musics.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const results = await this.musicsRepository.findMany({
      where: {
        userId,
      },
      select: {
        songId: true,
        title: true,
        artist: true,
        albumUrl: true,
        createdAt: true,
        diary: {
          include: {
            emotions: {
              select: {
                emotions: {
                  include: {
                    parent: {
                      include: {
                        parent: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    this.logService.verbose(
      `Get musics archive summary by user ${userId}`,
      MusicsService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get musics archive summary',
      musics: results,
      count: musicCount,
    };
  }
}

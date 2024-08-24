import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DiariesStatus, Prisma, TemplateContents } from '@prisma/client';
import { LogService } from '@common/log.service';
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
import { DiaryRepository } from './repository/diary.repository';
import { EmotionsRepository } from './repository/emotion.repository';
import { TemplatesRepository } from './repository/template.repository';
import { TopicsRepository } from './repository/topic.repository';
import { CommonDto } from '@common/dto/common.dto';
import { DiaryTopicsRepository } from './repository/diary-topics.repository';
import { DiaryEmotionsRepository } from './repository/diary-emotions.repository';
import { RecommendMusicResponseDto } from './dto/recommand-music.dto';
import { Condition } from 'dynamoose';
import { MusicModelRepository } from '@music/music-model.repository';
import { PrismaService } from '@database/prisma/prisma.service';
import { AIService } from '@service/ai/ai.service';
import { MusicModelDto } from '@music/dto/musics.dto';
import { MusicPreModelRepository } from '@music/music-pre-model.repository';
import { setKoreaTime } from '@common/util/date-time-converter';

@Injectable()
export class DiaryService {
  constructor(
    private readonly emotionsRepository: EmotionsRepository,
    private readonly topicsRepository: TopicsRepository,
    private readonly templatesRepository: TemplatesRepository,
    private readonly diariesRepository: DiaryRepository,
    private readonly diaryTopicsRepository: DiaryTopicsRepository,
    private readonly diaryEmotionsRepository: DiaryEmotionsRepository,
    private readonly musicModelRepository: MusicModelRepository,
    private readonly musicPreModelRepository: MusicPreModelRepository,
    private readonly prismaService: PrismaService,
    private readonly aiService: AIService,
    private readonly logService: LogService,
  ) {}

  async getEmotions(name?: string): Promise<FindEmotionsResponseDto> {
    const whereParams: Prisma.EmotionsFindManyArgs = name
      ? { where: { name } }
      : {};
    const emotions = await this.emotionsRepository.findAll(whereParams);
    this.logService.verbose(`Get all emotions`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      emotions,
    };
  }

  async getTopics(): Promise<FindTopicsResponseDto> {
    const findParams: Prisma.TopicsFindManyArgs = {
      orderBy: {
        order: 'asc',
      },
    };
    const topics = await this.topicsRepository.findAll(findParams);
    this.logService.verbose(`Get all topics`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      topics,
    };
  }

  async getTemplates(): Promise<FindTemplatesResponseDto> {
    const findParams: Prisma.TemplatesFindManyArgs = {
      where: { isExample: true },
      include: {
        templateContents: true,
      },
      orderBy: {
        order: 'asc',
      },
    };
    const templates = await this.templatesRepository.findAll(findParams);
    this.logService.verbose(`Get all templates`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      templates,
    };
  }

  async getDiariesArchive(
    userId: string,
    startAt?: string,
    endAt?: string,
    group?: string,
  ): Promise<FindDiariesResponseDto> {
    const findDiariesQuery: Prisma.DiariesFindManyArgs = {
      where: {
        userId,
        status: DiariesStatus.DONE,
        ...(startAt && { createdAt: { gte: new Date(startAt).toISOString() } }),
        ...(endAt && { createdAt: { lte: new Date(endAt).toISOString() } }),
        ...(startAt &&
          endAt && {
            createdAt: {
              gte: new Date(startAt).toISOString(),
              lte: new Date(endAt).toISOString(),
            },
          }),
      },
      ...(group && {
        include: {
          user: { select: { id: true } },
          emotions: {
            select: {
              emotions: { include: { parent: { include: { parent: true } } } },
            },
          },
          topics: { select: { topic: true } },
          musics: {
            select: {
              songId: true,
              title: true,
              artist: true,
              albumUrl: true,
              selected: true,
            },
          },
        },
      }),
    };
    const diaries = await this.diariesRepository.findAll(findDiariesQuery);
    this.logService.verbose(
      `Get all diaries archives from ${startAt} to ${endAt}`,
      DiaryService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all diaries archives',
      diaries,
    };
  }

  async getDiaries(
    userId: string,
    query?: GetDiariesQueryDto,
  ): Promise<FindDiariesResponseDto> {
    const findDiariesQuery: Prisma.DiariesFindManyArgs = {
      where: { userId },
      include: { musics: true },
    };
    if (query.status) {
      findDiariesQuery.where.status = query.status;
    }
    const diaries = await this.diariesRepository.findAll(findDiariesQuery);
    this.logService.verbose(`Get all diaries`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all diaries',
      diaries,
    };
  }

  async getDiary(id: string, userId: string): Promise<FindDiaryResponseDto> {
    const diary = await this.diariesRepository.findUniqueOne({
      where: { id, userId },
      include: {
        user: { select: { id: true } },
        emotions: {
          select: {
            emotions: { include: { parent: { include: { parent: true } } } },
          },
        },
        topics: { select: { topic: true } },
        templates: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            templateContents: true,
          },
        },
        musics: {
          select: {
            id: true,
            title: true,
            artist: true,
            albumUrl: true,
            selectedLyric: true,
            lyric: true,
            selected: true,
            youtubeUrl: true,
            editorPick: true,
          },
        },
      },
    });
    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    this.logService.verbose(`Get diary by ${diary.id}`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get diary',
      diary,
    };
  }

  async create(
    userId: string,
    body: CreateDiaryBodyDto,
  ): Promise<CreateDiaryResponseDto> {
    const createDiaryQuery: Prisma.DiariesCreateArgs = {
      data: {
        status: body.status,
        user: { connect: { id: userId } },
      },
    };
    const diary = await this.diariesRepository.create(createDiaryQuery);
    this.logService.verbose(`Create diary by ${diary.id}`, DiaryService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create diary',
      diaryId: diary.id,
    };
  }

  async recommendMusics(
    userId: string,
    id: string,
  ): Promise<RecommendMusicResponseDto> {
    let musicCandidates: Partial<MusicModelDto>[];
    await this.prismaService.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const diary = await tx.diaries.update({
          where: { id, userId },
          data: { status: DiariesStatus.PENDING },
          select: {
            id: true,
            userId: true,
            content: true,
            templates: { select: { templateContents: true } },
            emotions: {
              select: { emotions: { select: { id: true, aiScale: true } } },
            },
            user: {
              select: {
                id: true,
                isGenreSuggested: true,
                genre: { select: { label: true } },
              },
            },
          },
        });
        if (!diary) {
          throw new NotFoundException('Diary not found');
        }

        const requestAiData = {
          data:
            diary['templates'] === null
              ? diary.content
              : diary['templates'].templateContents
                  .map(
                    (templateContent: TemplateContents) =>
                      templateContent.content,
                  )
                  .join(' '),

          selected_genres: diary.user.genre.map((g) => g.label), // ['pop', 'rock', 'hiphop', 'ballad', 'rnb'],
          selected_feeling: diary.emotions.map(
            (emotion) => emotion.emotions.aiScale ?? 3,
          )[0], // # 1: 매우좋음, 2: 좋음, 3: 보통, 4:나쁨, 5:매우나쁨 --> 추후 다중선택
          selected_feeling_2: diary.emotions.map(
            (emotion) => emotion.emotions.aiScale,
          ) ?? [1, 2],
          genre_yn: Number(diary.user.isGenreSuggested) === 0 ? 0 : 1, // #0: 비선호 장르 추천 받지 않음, 1: 비선호 장르 추천 받음
        };

        const musicRecommendResult =
          await this.aiService.recommendMusicsToAI(requestAiData);

        const resultSongIds = Object.values(musicRecommendResult.songId).map(
          (songId) => songId.toString(),
        );
        musicCandidates = await Promise.all(
          resultSongIds.map(async (songId) => {
            const condition = new Condition().filter('songId').contains(songId);
            const [musicModels, musicPreModels] = await Promise.all([
              await this.musicModelRepository.findBySongId(condition),
              await this.musicPreModelRepository.findBySongId(condition),
            ]);

            const musicModel = musicModels[0];
            const musicPreModel = musicPreModels[0];
            const music = {
              songId: musicModel.songId,
              title: musicModel.title,
              albumUrl: musicModel.albumUrl,
              artist: musicModel.artist,
              lyric: musicModel.lyric,
              originalGenre: musicModel.genre,
              youtubeUrl: musicPreModel?.yt_url ?? null,
              editorPick: musicModel?.editor_name ?? null,
              diaryId: diary.id,
              userId,
              createdAt: setKoreaTime(),
              updatedAt: setKoreaTime(),
            };
            return await tx.musics.create({
              data: music,
              select: {
                id: true,
                title: true,
                artist: true,
                albumUrl: true,
                selectedLyric: true,
                lyric: true,
                selected: true,
                youtubeUrl: true,
                editorPick: true,
              },
            });
          }),
        );
        await tx.diaries.update({
          where: { id, userId },
          data: { status: DiariesStatus.EDIT },
        });
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );

    this.logService.verbose(`recommend musics by ${id}`, DiaryService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'recommend musics',
      data: musicCandidates,
    };
  }

  async update(
    id: string,
    userId: string,
    body: UpdateDiaryBodyDto,
  ): Promise<UpdateDiaryResponseDto> {
    await this.checkPermission(userId, id);
    const existed = await this.diariesRepository.findUniqueOne({
      where: { id },
    });
    if (!existed) {
      throw new NotFoundException('Diary not found');
    }
    const { status, title, content, ...restBody } = body;
    const updateDiaryDataQuery: Prisma.DiariesUpdateInput = {
      status,
      title,
      content,
    };
    if ('templates' in body && typeof body.templates === 'object') {
      const createTemplateDataQuery: Prisma.TemplatesCreateArgs = {
        data: {
          ...body.templates,
          templateContents: {
            create: body.templates.templateContents.map((content) => ({
              ...content,
            })),
          },
        },
      };
      const template = await this.templatesRepository.create(
        createTemplateDataQuery,
      );
      updateDiaryDataQuery.templates = {
        connect: { id: template.id },
      };
    }
    if ('topics' in body && typeof body.topics !== undefined) {
      const diaryTopics = await this.diaryTopicsRepository.findAll({
        where: { diaryId: id },
      });
      if (diaryTopics) {
        const deleteDiaryTopicsQuery: Prisma.DiaryTopicsDeleteManyArgs = {
          where: {
            diaryId: id,
            topicId: {
              in: diaryTopics.map((diaryTopic) => diaryTopic.topicId),
            },
          },
        };
        await this.diaryTopicsRepository.deleteMany(deleteDiaryTopicsQuery);
      }
      const createDiaryTopicsData: Prisma.DiaryTopicsCreateManyInput[] =
        body.topics.map((topic) => ({
          diaryId: id,
          topicId: topic.id,
          musicId: body.music?.id ?? null,
          userId,
        }));
      const createDiaryTopicsQuery: Prisma.DiaryTopicsCreateManyArgs = {
        data: createDiaryTopicsData,
      };
      await this.diaryTopicsRepository.createMany(createDiaryTopicsQuery);
    }
    if ('emotions' in body && typeof body.emotions === 'object') {
      const findDiaryEmotionsQuery: Prisma.DiaryEmotionsFindManyArgs = {
        where: { diaryId: id },
      };
      const diaryEmotions = await this.diaryEmotionsRepository.findAll(
        findDiaryEmotionsQuery,
      );
      if (diaryEmotions) {
        const deleteDiaryEmotionsQuery: Prisma.DiaryEmotionsDeleteManyArgs = {
          where: {
            diaryId: id,
            emotionId: {
              in: diaryEmotions.map((diaryEmotion) => diaryEmotion.emotionId),
            },
          },
        };
        await this.diaryEmotionsRepository.deleteMany(deleteDiaryEmotionsQuery);
      }
      const createDiaryEmotionsQuery: Prisma.DiaryEmotionsCreateManyArgs = {
        data: body.emotions.map((emotion) => ({
          diaryId: id,
          emotionId: emotion.id,
          musicId: body.music?.id ?? null,
          userId,
        })),
      };
      await this.diaryEmotionsRepository.createMany(createDiaryEmotionsQuery);
    }
    if ('music' in body && typeof body.music === 'object') {
      const { id: musicId, ...restMusic } = body.music;
      updateDiaryDataQuery.musics = {
        update: {
          where: { id: musicId },
          data: { ...restMusic, updatedAt: setKoreaTime() },
        },
      };
    }
    const updateDiaryQuery: Prisma.DiariesUpdateArgs = {
      where: { id },
      data: { ...updateDiaryDataQuery },
    };
    const result = await this.diariesRepository.update(updateDiaryQuery);

    this.logService.verbose(`Update diary by ${result.id}`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Update diary',
      diaryId: result.id,
    };
  }

  async delete(id: string, userId: string): Promise<CommonDto> {
    const deleteDiaryWhereParams = { id, userId };
    const diary = await this.diariesRepository.softDelete(
      deleteDiaryWhereParams,
    );
    this.logService.verbose(`Delete diary by ${diary.id}`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Delete diary',
    };
  }

  private async checkPermission(
    userId: string,
    targetId: string,
  ): Promise<boolean> {
    const existedDiary = await this.diariesRepository.findUniqueOne({
      where: { id: targetId, userId },
    });
    if (existedDiary === undefined) {
      throw new NotFoundException('Diary not found');
    }
    return true;
  }

  private getEndDate(endAt: string): string {
    const endDate = new Date(endAt);
    endDate.setDate(endDate.getDate() + 1);
    return endDate.toISOString();
  }
}

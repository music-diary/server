import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DiariesStatus,
  Prisma,
  TemplateContents,
  DiaryTopics,
  DiaryEmotions,
} from '@prisma/client';
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
import { PrismaService } from '@database/prisma/prisma.service';
import { AIService } from '@service/ai/ai.service';
import { MusicAiModelDto, MusicsDto } from '@music/dto/musics.dto';
import { setKoreaTime } from '@common/util/date-time-converter';
import { MusicRepository } from '@music/music.repository';
import { MusicAiModelRepository } from '@music/music-ai.repository';
import { DiaryDto } from './dto/diaries.dto';
import { parseDateRange } from '@common/util/parse-date-range';
import { TopicsDto } from './dto/topics.dto';
import { EmotionsDto } from './dto/emotions.dto';
import { TemplatesDto } from './dto/templates.dto';
import { GenresDto } from '@genre/dto/genres.dto';
import { UsersDto } from '@user/dto/user.dto';
import { RecommendMusicToAIBodyDto } from '@service/ai/dto/recommend-ai.dto';

@Injectable()
export class DiaryService {
  constructor(
    private readonly emotionsRepository: EmotionsRepository,
    private readonly topicsRepository: TopicsRepository,
    private readonly templatesRepository: TemplatesRepository,
    private readonly diariesRepository: DiaryRepository,
    private readonly diaryTopicsRepository: DiaryTopicsRepository,
    private readonly diaryEmotionsRepository: DiaryEmotionsRepository,
    private readonly musicAiModelRepository: MusicAiModelRepository,
    private readonly musicsRepository: MusicRepository,
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
    const { startDate, endDate } = parseDateRange(startAt, endAt);
    const findDiariesQuery: Prisma.DiariesFindManyArgs = {
      where: {
        userId,
        status: DiariesStatus.DONE,
        ...(startAt && { updatedAt: { gte: startDate } }),
        ...(endAt && { updatedAt: { lt: endDate } }),
        ...(startAt && endAt && { updatedAt: { gte: startDate, lt: endDate } }),
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
    let musicCandidates: Partial<MusicAiModelDto>[];
    const user = await this.getUserWithGenres(userId);

    try {
      await this.prismaService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const diary = await this.updateDiaryStatusToPending(tx, id, userId);
          const requestAiData = this.createRequestAiData(diary, user);

          const musicRecommendResult =
            await this.aiService.recommendMusicsToAI(requestAiData);
          const resultSongIds = this.extractSongIds(musicRecommendResult);

          await this.musicsRepository.deleteMany({
            where: { diaryId: diary.id },
          });
          musicCandidates = await this.createMusicCandidates(
            tx,
            resultSongIds,
            diary.id,
            userId,
          );
          await this.updateDiaryStatusToEdit(tx, id, userId);
        },
        {
          maxWait: 7000,
          timeout: 13000,
        },
      );
      this.logService.verbose(`recommend musics by ${id}`, DiaryService.name);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'recommend musics',
        data: musicCandidates,
      };
    } catch (error) {
      this.logService.error(JSON.stringify(error), DiaryService.name);
      throw new InternalServerErrorException(
        `Fail to Recommend Musics by diary ${id}`,
      );
    }
  }

  async update(
    id: string,
    userId: string,
    body: UpdateDiaryBodyDto,
  ): Promise<UpdateDiaryResponseDto> {
    console.debug('UpdateDiaryBodyDto', body);
    await this.checkPermission(userId, id);
    const existed = await this.diariesRepository.findUniqueOne({
      where: { id },
    });
    if (
      !existed ||
      existed.deletedAt ||
      existed.status === DiariesStatus.DONE
    ) {
      throw new NotFoundException('Diary not found');
    }
    if (body.status === DiariesStatus.EDIT) {
      await this.updateDiaryToEdit(id, userId, body);
    } else if (body.status === DiariesStatus.DONE) {
      await this.updateDiaryToDone(id, userId, body);
    }

    this.logService.verbose(`Update diary by ${id}`, DiaryService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Update diary',
      diaryId: id,
    };
  }

  async delete(id: string, userId: string): Promise<CommonDto> {
    await this.checkPermission(userId, id);
    await this.prismaService.$transaction([
      this.prismaService.diaries.update({
        where: { id, userId },
        data: { deletedAt: new Date() },
      }),
      this.prismaService.diaryTopics.deleteMany({
        where: { diaryId: id },
      }),
      this.prismaService.diaryEmotions.deleteMany({
        where: { diaryId: id },
      }),
      this.prismaService.musics.updateMany({
        where: { diaryId: id },
        data: { deletedAt: new Date() },
      }),
    ]);

    this.logService.verbose(`Delete diary by ${id}`, DiaryService.name);
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

  private async updateDiaryToEdit(
    id: string,
    userId: string,
    body: UpdateDiaryBodyDto,
  ): Promise<DiaryDto> {
    const {
      status,
      title,
      content,
      templates,
      topics,
      emotions,
      music,
      ..._restBody
    } = body;
    const updateDiaryDataQuery: Prisma.DiariesUpdateInput = {
      status,
      title,
      content,
    };

    if ('templates' in body && typeof templates === 'object') {
      const template = await this.updateEditedDiaryTemplate(templates);
      updateDiaryDataQuery.templates = { connect: { id: template.id } };
    }

    if (topics) {
      await this.updateEditedDiaryTopics(id, userId, topics, music);
    }

    if (emotions && typeof emotions === 'object') {
      await this.updateEditedDiaryEmotions(id, userId, emotions, music);
    }

    if (music && typeof music === 'object') {
      const { id: musicId, ...restMusic } = music;
      updateDiaryDataQuery.musics = {
        update: {
          where: { id: musicId },
          data: { ...restMusic, updatedAt: setKoreaTime() },
        },
      };
      await this.updateEditedDiaryMusic(id, music);
    }
    return await this.diariesRepository.update({
      where: { id },
      data: { ...updateDiaryDataQuery },
    });
  }

  private async updateDiaryToDone(
    id: string,
    userId: string,
    body: UpdateDiaryBodyDto,
  ): Promise<DiaryDto> {
    const { status, music, ..._restBody } = body;
    const existedDiary = await this.diariesRepository.findUniqueOne({
      where: { id },
      include: { emotions: true, topics: true },
    });
    return await this.diariesRepository.update({
      where: { id },
      data: {
        status,
        musics: {
          update: { where: { id: music.id }, data: music },
        },
        topics: {
          updateMany: existedDiary['topics'].map((diaryTopic: DiaryTopics) => {
            return {
              where: { id: diaryTopic.id },
              data: { updatedAt: setKoreaTime(), musicId: music.id },
            };
          }),
        },
        emotions: {
          updateMany: existedDiary['emotions'].map(
            (diaryEmotion: DiaryEmotions) => {
              return {
                where: { id: diaryEmotion.id },
                data: { updatedAt: setKoreaTime(), musicId: music.id },
              };
            },
          ),
        },
      },
    });
  }

  private async updateEditedDiaryTemplate(
    templates: TemplatesDto,
  ): Promise<TemplatesDto> {
    return await this.templatesRepository.create({
      data: {
        ...templates,
        templateContents: {
          create: templates.templateContents.map((content) => ({
            ...content,
          })),
        },
      },
    });
  }

  private async updateEditedDiaryTopics(
    id: string,
    userId: string,
    topics: Array<TopicsDto>,
    music?: MusicsDto,
  ): Promise<void> {
    await this.diaryTopicsRepository.deleteMany({
      where: {
        diaryId: id,
        topicId: {
          in: (
            await this.diaryTopicsRepository.findAll({
              where: { diaryId: id },
            })
          ).map((dt) => dt.topicId),
        },
      },
    });
    await this.diaryTopicsRepository.createMany({
      data: topics.map((topic) => ({
        diaryId: id,
        topicId: topic.id,
        musicId: music?.id ?? null,
        userId,
      })),
    });
  }

  private async updateEditedDiaryEmotions(
    id: string,
    userId: string,
    emotions: Array<EmotionsDto>,
    music?: MusicsDto,
  ): Promise<void> {
    await this.diaryEmotionsRepository.deleteMany({
      where: {
        diaryId: id,
        emotionId: {
          in: (
            await this.diaryEmotionsRepository.findAll({
              where: { diaryId: id },
            })
          ).map((de) => de.emotionId),
        },
      },
    });
    await this.diaryEmotionsRepository.createMany({
      data: emotions.map((emotion) => ({
        diaryId: id,
        emotionId: emotion.id,
        musicId: music?.id ?? null,
        userId,
      })),
    });
  }

  private async updateEditedDiaryMusic(
    id: string,
    music: MusicsDto,
  ): Promise<void> {
    const { id: musicId, ..._restMusic } = music;
    await this.musicsRepository.updateMany({
      where: { AND: [{ diaryId: id }, { id: { not: musicId } }] },
      data: { selected: false },
    });
  }

  private async getUserWithGenres(userId: string): Promise<Partial<UsersDto>> {
    return await this.prismaService.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isGenreSuggested: true,
        genre: { select: { label: true } },
      },
    });
  }

  private async getAllGenres(): Promise<Partial<GenresDto>[]> {
    return await this.prismaService.genres.findMany({
      select: { label: true },
    });
  }

  private async updateDiaryStatusToPending(
    tx: Prisma.TransactionClient,
    id: string,
    userId: string,
  ): Promise<Partial<DiaryDto>> {
    const diary = await tx.diaries.update({
      where: { id, userId },
      data: { status: DiariesStatus.PENDING },
      select: {
        id: true,
        userId: true,
        content: true,
        templates: true,
        emotions: {
          select: { emotions: true },
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
    return diary;
  }

  private createRequestAiData(
    diary: Partial<DiaryDto>,
    user: Partial<UsersDto>,
  ): RecommendMusicToAIBodyDto {
    return {
      data:
        diary['templates'] === null
          ? diary.content
          : diary['templates'].templateContents
              .map(
                (templateContent: TemplateContents) => templateContent.content,
              )
              .join(' '),
      selected_genres: user['genre'].map((genre: GenresDto) => genre.label),
      selected_feeling: diary['emotions'].map(
        (emotion) => emotion['emotions'].aiScale ?? 3,
      )[0],
      selected_feeling_2: diary['emotions'].map(
        (emotion) => emotion.emotions.aiScale,
      ) ?? [1, 2],
      genre_yn: Number(user.isGenreSuggested) === 0 ? 0 : 1,
      userId: user['id'],
    };
  }

  private extractSongIds(musicRecommendResult: any): Array<string> {
    return Object.values(musicRecommendResult.songId).map((songId) =>
      songId.toString(),
    );
  }

  private async createMusicCandidates(
    tx: Prisma.TransactionClient,
    resultSongIds: string[],
    diaryId: string,
    userId: string,
  ): Promise<Partial<MusicsDto>[]> {
    try {
      return await Promise.all(
        resultSongIds.map(async (resultSongId): Promise<Partial<MusicsDto>> => {
          const condition = new Condition()
            .filter('songId')
            .contains(resultSongId);
          const musicAiModel =
            await this.musicAiModelRepository.findBySongId(condition);
          const musicModel = musicAiModel[0];

          const {
            songId,
            title,
            albumUrl,
            artist,
            yt_url,
            lyric,
            genre,
            editor_pick,
            editor_name,
            ..._restMusicModel
          } = musicModel;

          const music = {
            songId,
            title: title.replaceAll('"', ''),
            albumUrl,
            artist,
            lyric: lyric.replaceAll('\\n', '\n'),
            originalGenre: genre.replaceAll('"', ''),
            youtubeUrl: yt_url,
            editorPick: editor_pick === 'None' ? null : editor_name,
            diaryId,
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
    } catch (error) {
      this.logService.error(JSON.stringify(error), DiaryService.name);
      throw new InternalServerErrorException(`Fail to create Music Candidates`);
    }
  }

  private async updateDiaryStatusToEdit(
    tx: Prisma.TransactionClient,
    id: string,
    userId: string,
  ): Promise<void> {
    await tx.diaries.update({
      where: { id, userId },
      data: { status: DiariesStatus.EDIT },
    });
  }
}

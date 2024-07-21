import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DiariesStatus, Prisma } from '@prisma/client';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateDiaryBodyDto,
  CreateDiaryResponseDto,
} from './dto/create.diary.dto';
import {
  FindDiariesResponseDto,
  FindDiaryResponseDto,
} from './dto/find.diary.dto';
import { FindEmotionsResponseDto } from './dto/find.emotions.dto';
import { FindTemplatesResponseDto } from './dto/find.templates.dto';
import { FindTopicsResponseDto } from './dto/find.topics.dto';
import {
  UpdateDiaryBodyDto,
  UpdateDiaryResponseDto,
} from './dto/update.diary.dto';
import { DiariesRepository } from './repository/diaires.repository';
import { EmotionsRepository } from './repository/emotions.repository';
import { TemplatesRepository } from './repository/templates.repository';
import { TopicsRepository } from './repository/topics.repository';
import { CommonDto } from 'src/common/common.dto';
import { DiaryTopicsRepository } from './repository/diairy-topics.repository';
import { DiaryEmotionsRepository } from './repository/diairy-emotions.repository';

@Injectable()
export class DiariesService {
  constructor(
    private readonly emotionsRepository: EmotionsRepository,
    private readonly topicsRepository: TopicsRepository,
    private readonly templatesRepository: TemplatesRepository,
    private readonly diariesRepository: DiariesRepository,
    private readonly diaryTopicsRepository: DiaryTopicsRepository,
    private readonly diaryEmotionsRepository: DiaryEmotionsRepository,
    private readonly prismaService: PrismaService,
    private readonly logService: LogService,
  ) {}

  async getEmotions(name?: string): Promise<FindEmotionsResponseDto> {
    const whereParams: Prisma.EmotionsFindManyArgs = name
      ? { where: { name } }
      : {};
    const emotions = await this.emotionsRepository.findAll(whereParams);
    this.logService.verbose(`Get all emotions`, DiariesService.name);
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
    this.logService.verbose(`Get all topics`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      topics,
    };
  }

  async getTemplates(): Promise<FindTemplatesResponseDto> {
    const findParams: Prisma.TemplatesFindManyArgs = {
      include: {
        templateContents: true,
      },
      orderBy: {
        order: 'asc',
      },
    };
    const templates = await this.templatesRepository.findAll(findParams);
    this.logService.verbose(`Get all templates`, DiariesService.name);
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
    const endDate = new Date(endAt).setDate(new Date(endAt).getDate() + 1);
    const findDiariesQuery: Prisma.DiariesFindManyArgs = {
      where: {
        userId,
        status: DiariesStatus.DONE,
      },
    };
    if (startAt) {
      findDiariesQuery.where.createdAt = {
        gte: new Date(startAt).toISOString(),
      };
    }
    if (endAt) {
      findDiariesQuery.where.createdAt = {
        lte: new Date(endDate).toISOString(),
      };
    }
    if (Boolean(group)) {
      findDiariesQuery.include = {
        user: { select: { id: true } },
        emotions: {
          select: {
            emotions: { include: { parent: { include: { parent: true } } } },
          },
        },
        topics: { select: { topic: true } },
        musics: {
          select: { songId: true, title: true, artist: true, albumUrl: true },
        },
      };
    }
    const diaries = await this.diariesRepository.findAll(findDiariesQuery);
    this.logService.verbose(
      `Get all diaries archives from ${startAt} to ${endAt}`,
      DiariesService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all diaries archives',
      diaries,
    };
  }

  async getDiaries(userId: string): Promise<FindDiariesResponseDto> {
    const findDiariesQuery: Prisma.DiariesFindManyArgs = { where: { userId } };
    const diaries = await this.diariesRepository.findAll(findDiariesQuery);
    this.logService.verbose(`Get all diaries`, DiariesService.name);
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
          },
        },
      },
    });
    if (!diary) {
      throw new NotFoundException('Diary not found');
    }

    this.logService.verbose(`Get diary by ${diary.id}`, DiariesService.name);
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
    this.logService.verbose(`Create diary by ${diary.id}`, DiariesService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create diary',
      diaryId: diary.id,
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
      // include: { emotions: true, topics: true },
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
      updateDiaryDataQuery.templates = {
        connect: { id: body.templates.id },
      };
      const updateTemplateDataQuery: Prisma.TemplatesUpdateArgs = {
        where: { id: body.templates.id },
        data: {
          templateContents: {
            update: body.templates.templateContents.map((templateContent) => ({
              where: { id: templateContent.id },
              data: {
                content: templateContent.content,
              },
            })),
          },
        },
      };
      await this.templatesRepository.update(updateTemplateDataQuery);
    }
    const updateDiaryQuery: Prisma.DiariesUpdateArgs = {
      where: { id },
      data: {
        ...updateDiaryDataQuery,
      },
    };
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
        })),
      };
      await this.diaryEmotionsRepository.createMany(createDiaryEmotionsQuery);
    }
    if ('music' in body && typeof body.music === 'object') {
      updateDiaryDataQuery.musics = {
        connect: {
          id: body.music.id,
        },
      };
    }
    const result = await this.diariesRepository.update(updateDiaryQuery);

    this.logService.verbose(
      `Update diary by ${result.id}`,
      DiariesService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Update diary',
      diaryId: result.id,
    };
  }

  async delete(id: string, userId: string): Promise<CommonDto> {
    const deleteDiaryParams: Prisma.DiariesDeleteArgs = {
      where: { id, userId },
    };
    const diary = await this.diariesRepository.delete(deleteDiaryParams);
    this.logService.verbose(`Delete diary by ${diary.id}`, DiariesService.name);
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
}

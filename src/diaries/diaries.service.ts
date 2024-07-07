import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

@Injectable()
export class DiariesService {
  constructor(
    private readonly emotionsRepository: EmotionsRepository,
    private readonly topicsRepository: TopicsRepository,
    private readonly templatesRepository: TemplatesRepository,
    private readonly diariesRepository: DiariesRepository,
    private readonly prismaService: PrismaService,
    private readonly logService: LogService,
  ) {}

  async getEmotions(): Promise<FindEmotionsResponseDto> {
    const emotions = await this.emotionsRepository.findAll();
    this.logService.verbose(`Get all emotions`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      emotions,
    };
  }

  async getTopics(): Promise<FindTopicsResponseDto> {
    const topics = await this.topicsRepository.findAll();
    this.logService.verbose(`Get all topics`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      topics,
    };
  }

  async getTemplates(): Promise<FindTemplatesResponseDto> {
    const templates = await this.templatesRepository.findAll();
    this.logService.verbose(`Get all templates`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all emotions',
      templates,
    };
  }

  async getDiaries(userId: string): Promise<FindDiariesResponseDto> {
    const findDiariesQuery: Prisma.DiariesFindManyArgs = {
      where: { userId },
      include: {
        emotions: {
          select: {
            emotions: true,
          },
        },
        topics: {
          select: {
            topic: true,
          },
        },
        templates: true,
      },
    };
    const diaries = await this.diariesRepository.findAll(findDiariesQuery);
    this.logService.verbose(`Get all diaries`, DiariesService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all diaries',
      diaries,
    };
  }

  async getDiary(id: string, userId: string): Promise<FindDiaryResponseDto> {
    const diary = await this.diariesRepository.findOne({
      where: { id, userId },
      include: {
        emotions: {
          select: {
            emotions: true,
          },
        },
        topics: {
          select: {
            topic: true,
          },
        },
        templates: true,
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
        users: { connect: { id: userId } },
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
    const result = await this.prismaService.$transaction(async (tx) => {
      const existed = await tx.diaries.findFirst({ where: { id } });
      if (!existed) {
        throw new NotFoundException('Diary not found');
      }
      const { status, title, content, ...restBody } = body;
      const updateDiaryDataQuery: Prisma.DiariesUpdateInput = {
        status,
        title,
        content,
      };
      if ('templateId' in body && body.templateId !== null) {
        console.log('templateId', body.templateId);
        updateDiaryDataQuery.templates = {
          connect: { id: body.templateId },
        };
      }
      const updateDiaryQuery: Prisma.DiariesUpdateArgs = {
        where: { id },
        data: {
          ...updateDiaryDataQuery,
        },
      };
      if ('topics' in body && typeof body.topics === 'object') {
        const findDiaryToTopicsQuery: Prisma.DiaryTopicsFindManyArgs = {
          where: { diaryId: id },
        };
        const diaryTopics = await tx.diaryTopics.findMany(
          findDiaryToTopicsQuery,
        );
        if (diaryTopics) {
          const deleteDiaryTopicsQuery: Prisma.DiaryTopicsDeleteManyArgs = {
            where: {
              diaryId: id,
              topicId: {
                in: diaryTopics.map((diaryTopic) => diaryTopic.topicId),
              },
            },
          };
          await tx.diaryTopics.deleteMany(deleteDiaryTopicsQuery);
        }
        const createDiaryTopicsQuery: Prisma.DiaryTopicsCreateManyArgs = {
          data: body.topics.map((topic) => ({
            diaryId: id,
            topicId: topic.id,
          })),
        };
        await tx.diaryTopics.createMany(createDiaryTopicsQuery);
      }

      if ('emotions' in body && typeof body.emotions === 'object') {
        const findDiaryEmotionsQuery: Prisma.DiaryEmotionsFindManyArgs = {
          where: { diaryId: id },
        };
        const diaryEmotions = await tx.diaryEmotions.findMany(
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
          await tx.diaryEmotions.deleteMany(deleteDiaryEmotionsQuery);
        }
        const createDiaryEmotionsQuery: Prisma.DiaryEmotionsCreateManyArgs = {
          data: body.emotions.map((emotion) => ({
            diaryId: diary.id,
            emotionId: emotion.id,
          })),
        };
        await tx.diaryEmotions.createMany(createDiaryEmotionsQuery);
      }
      const diary = await tx.diaries.update(updateDiaryQuery);

      return diary;
    });
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

  private async checkPermission(
    userId: string,
    targetId: string,
  ): Promise<boolean> {
    const existedDiary = await this.diariesRepository.findOne({
      where: { id: targetId, userId },
    });
    if (existedDiary === undefined) {
      throw new NotFoundException('Diary not found');
    }
    return true;
  }
}

import { Injectable } from '@nestjs/common';
import { DiariesStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { DiaryDto } from 'src/diaries/dto/diaries.dto';
import { MusicsDto } from 'src/musics/dto/musics.dto';
import { GenresDto } from 'src/genres/dto/genres.dto';

@Injectable()
export class StatisticRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findDiariesStatistic(
    query?: Prisma.DiariesFindManyArgs,
  ): Promise<DiaryDto[]> {
    return await this.prismaService.diaries.findMany(query);
  }

  async findMusicsStatistic(
    query?: Prisma.MusicsFindManyArgs,
  ): Promise<MusicsDto[]> {
    return await this.prismaService.musics.findMany(query);
  }

  async findGenres(query?: Prisma.GenresFindManyArgs): Promise<GenresDto[]> {
    return await this.prismaService.genres.findMany(query);
  }

  async findTopicsStatistic(
    query?: Prisma.DiaryTopicsWhereInput,
  ): Promise<any> {
    return await this.prismaService.diaryTopics.findMany({
      where: query,
      distinct: ['topicId'],
      include: {
        topic: { select: { id: true, label: true, emoji: true, _count: true } },
      },
      orderBy: { topic: { diaries: { _count: 'desc' } } },
      take: 3,
    });
  }

  async getMonthlyDiaryCount(query: Prisma.DiariesCountArgs): Promise<number> {
    return await this.prismaService.diaries.count(query);
  }

  async getYearlyDiariesCount(query: Prisma.DiariesCountArgs): Promise<number> {
    return await this.prismaService.diaries.count(query);
  }

  async getDiaries(query: Prisma.DiariesFindManyArgs): Promise<DiaryDto[]> {
    return await this.prismaService.diaries.findMany(query);
  }

  async getEmotionStatistic(query: any): Promise<any> {
    const emotionsWithRoot = await this.prismaService.diaryEmotions.findMany({
      where: { ...query, diary: { status: DiariesStatus.DONE } },
      select: {
        emotions: {
          select: {
            rootId: true,
            id: true,
            label: true,
          },
        },
      },
    });

    // Calculate frequency of each rootId and emotions within each rootId
    const rootIdFrequency = emotionsWithRoot.reduce(
      (acc, current) => {
        const rootId = current.emotions.rootId;
        const emotionLabel = current.emotions.label;
        if (rootId) {
          if (!acc[rootId]) {
            acc[rootId] = { count: 0, emotions: {} };
          }
          acc[rootId].count += 1;
          if (!acc[rootId].emotions[emotionLabel]) {
            acc[rootId].emotions[emotionLabel] = 0;
          }
          acc[rootId].emotions[emotionLabel] += 1;
        }
        return acc;
      },
      {} as Record<string, { count: number; emotions: Record<string, number> }>,
    );

    // Find the rootId with the highest frequency
    let mostFrequentRootId = '';
    if (Object.keys(rootIdFrequency).length > 0) {
      mostFrequentRootId = Object.keys(rootIdFrequency).reduce((a, b) =>
        rootIdFrequency[a].count > rootIdFrequency[b].count ? a : b,
      );
    }

    const topEmotions = mostFrequentRootId
      ? Object.entries(rootIdFrequency[mostFrequentRootId].emotions)
          .sort(([, aCount], [, bCount]) => bCount - aCount)
          .slice(0, 3)
          .map(([emotionLabel]) => emotionLabel)
      : [];

    const rootIdStats = await Promise.all(
      Object.keys(rootIdFrequency).map(async (rootId) => {
        const { count, emotions } = rootIdFrequency[rootId];
        // const percentage = ((count / totalEmotions) * 100).toFixed();

        const rootEmotion = await this.prismaService.emotions.findUnique({
          where: {
            id: rootId,
          },
          select: {
            name: true,
          },
        });

        return {
          rootId,
          rootIdName: rootEmotion?.name || '',
          count,
          topEmotions: rootId === mostFrequentRootId ? topEmotions : [],
        };
      }),
    );
    return rootIdStats;
  }
}

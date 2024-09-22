import { Injectable } from '@nestjs/common';
import { DiariesStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { MusicsDto } from '@music/dto/musics.dto';
import { GenresDto } from '@genre/dto/genres.dto';

@Injectable()
export class StatisticRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMusicsStatistic(
    query?: Prisma.MusicsFindManyArgs,
  ): Promise<MusicsDto[]> {
    return await this.prismaService.client.musics.findManyAvailable(query);
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
        topic: {
          select: {
            id: true,
            label: true,
            emoji: true,
            _count: { select: { diaries: { where: { ...query } } } },
          },
        },
      },
      orderBy: { topic: { diaries: { _count: 'desc' } } },
      take: 3,
    });
  }

  async getEmotionStatistic(
    query: Prisma.DiaryEmotionsWhereInput,
  ): Promise<any> {
    const rootEmotions = await this.prismaService.emotions.findMany({
      where: { level: 0 },
    });
    const rootStandard = { good: 0, normal: 1, bad: 2 };
    const rootEmotionStandard = rootEmotions.map((root) => {
      const result = new Map();
      if (Object.keys(rootStandard).includes(root.name)) {
        return result.set(root.id, rootStandard[root.name]);
      }
    });
    const emotionsWithRoot = await this.prismaService.diaryEmotions.findMany({
      where: {
        ...query,
      },
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
        rootIdFrequency[a].count > rootIdFrequency[b].count &&
        rootEmotionStandard[a] > rootEmotionStandard[b]
          ? b
          : a,
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

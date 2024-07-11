import { HttpStatus, Injectable } from '@nestjs/common';
import { MusicsRepository } from './musics.repository';
import { PrismaService } from 'src/database/prisma.service';
import { LogService } from 'src/common/log.service';
import { FindAllMusicsResponse } from './dto/find-music.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MusicsService {
  constructor(
    private readonly musicsRepository: MusicsRepository,
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
            id: true,
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
}

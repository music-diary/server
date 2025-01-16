import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicRepository } from './music.repository';
import { JwtService } from '@nestjs/jwt';
import { DynamooseModule } from 'nestjs-dynamoose';
import { PrismaService } from '@database/prisma/prisma.service';
import { DiaryRepository } from '@diary/repository/diary.repository';
import { EmotionsRepository } from '@diary/repository/emotion.repository';
import { LogService } from '@common/log.service';
import { MusicAiSchema } from './schema/music-ai.schema';
import { StatisticRepository } from '@user/statistic.repository';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'MusicAiModel',
        schema: MusicAiSchema,
        options: {
          tableName: 'musicdiary_db',
        },
      },
    ]),
  ],
  controllers: [MusicController],
  providers: [
    MusicService,
    PrismaService,
    MusicRepository,
    DiaryRepository,
    EmotionsRepository,
    StatisticRepository,
    LogService,
    JwtService,
  ],
})
export class MusicModule {}

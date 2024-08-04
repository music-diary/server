import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { DiaryRepository } from './repository/diary.repository';
import { EmotionsRepository } from './repository/emotion.repository';
import { TemplatesRepository } from './repository/template.repository';
import { TopicsRepository } from './repository/topic.repository';
import { DiaryEmotionsRepository } from './repository/diary-emotions.repository';
import { DiaryTopicsRepository } from './repository/diary-topics.repository';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MusicSchema } from '@music/schema/music.schema';
import { DatabaseModule } from 'database/database.module';
import { LogService } from '@common/log.service';
import { PrismaService } from '@database/prisma/prisma.service';
import { MusicModelRepository } from '@music/music-model.repository';
import { MusicRepository } from '@music/music.repository';
import { AIService } from '@service/ai/ai.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Music',
        schema: MusicSchema,
        options: {
          tableName: 'musicdiary_table',
        },
      },
    ]),
    DatabaseModule,
  ],
  providers: [
    DiaryService,
    JwtService,
    LogService,
    PrismaService,
    EmotionsRepository,
    TopicsRepository,
    TemplatesRepository,
    DiaryRepository,
    DiaryEmotionsRepository,
    DiaryTopicsRepository,
    MusicModelRepository,
    MusicRepository,
    AIService,
  ],
  controllers: [DiaryController],
})
export class DiaryModule {}

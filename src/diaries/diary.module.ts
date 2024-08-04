import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { DiaryRepository } from './repository/diairy.repository';
import { EmotionsRepository } from './repository/emotion.repository';
import { TemplatesRepository } from './repository/template.repository';
import { TopicsRepository } from './repository/topic.repository';
import { DiaryEmotionsRepository } from './repository/diairy-emotions.repository';
import { DiaryTopicsRepository } from './repository/diairy-topics.repository';
import { AIService } from 'src/ai/ai.service';
import { MusicModelRepository } from 'src/musics/music-model.repository';
import { MusicsRepository } from 'src/musics/musics.repository';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MusicSchema } from 'src/musics/schema/music.schema';
import { DatabaseModule } from 'src/database/database.module';

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
    MusicsRepository,
    AIService,
  ],
  controllers: [DiaryController],
})
export class DiariesModule {}

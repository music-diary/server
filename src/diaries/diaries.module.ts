import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { DiariesRepository } from './repository/diaires.repository';
import { EmotionsRepository } from './repository/emotions.repository';
import { TemplatesRepository } from './repository/templates.repository';
import { TopicsRepository } from './repository/topics.repository';
import { DiaryEmotionsRepository } from './repository/diairy-emotions.repository';
import { DiaryTopicsRepository } from './repository/diairy-topics.repository';
import { AIService } from 'src/ai/ai.service';
import { MusicModelRepository } from 'src/musics/music-model.repository';
import { MusicsRepository } from 'src/musics/musics.repository';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MusicSchema } from 'src/musics/schema/music.schema';

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
  ],
  providers: [
    DiariesService,
    JwtService,
    LogService,
    PrismaService,
    EmotionsRepository,
    TopicsRepository,
    TemplatesRepository,
    DiariesRepository,
    DiaryEmotionsRepository,
    DiaryTopicsRepository,
    MusicModelRepository,
    MusicsRepository,
    AIService,
  ],
  controllers: [DiariesController],
})
export class DiariesModule {}

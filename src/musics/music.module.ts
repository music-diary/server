import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicRepository } from './music.repository';
import { JwtService } from '@nestjs/jwt';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MusicSchema } from './schema/music.schema';
import { PrismaService } from '@database/prisma/prisma.service';
import { DiaryRepository } from '@diary/repository/diary.repository';
import { EmotionsRepository } from '@diary/repository/emotion.repository';
import { LogService } from '@common/log.service';
import { MusicPreprocessSchema } from './schema/music-preprocess.schema';

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
      {
        name: 'MusicPreprocess',
        schema: MusicPreprocessSchema,
        options: {
          tableName: 'musicdiary_preprocess',
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
    LogService,
    JwtService,
  ],
})
export class MusicModule {}

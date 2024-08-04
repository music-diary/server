import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { PrismaService } from 'src/database/prisma.service';
import { MusicRepository } from './music.repository';
import { LogService } from 'src/common/log.service';
import { JwtService } from '@nestjs/jwt';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MusicSchema } from './schema/music.schema';
import { DiaryRepository } from 'src/diaries/repository/diairy.repository';
import { EmotionsRepository } from 'src/diaries/repository/emotion.repository';

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

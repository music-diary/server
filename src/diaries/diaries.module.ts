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

@Module({
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
  ],
  controllers: [DiariesController],
})
export class DiariesModule {}

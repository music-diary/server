import { Module } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { EmotionsRepository } from './repository/emotions.repository';
import { TemplatesRepository } from './repository/templates.repository';
import { TopicsRepository } from './repository/topics.repository';

@Module({
  providers: [
    DiariesService,
    LogService,
    PrismaService,
    EmotionsRepository,
    TopicsRepository,
    TemplatesRepository,
  ],
  controllers: [DiariesController],
})
export class DiariesModule {}

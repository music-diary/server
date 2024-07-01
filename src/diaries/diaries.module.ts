import { Module } from '@nestjs/common';
import { LogService } from 'src/common/log.service';
import { PrismaService } from 'src/database/prisma.service';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { EmotionsRepository } from './emotions.repository';

@Module({
  providers: [DiariesService, LogService, PrismaService, EmotionsRepository],
  controllers: [DiariesController],
})
export class DiariesModule {}

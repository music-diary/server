import { Module } from '@nestjs/common';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { PrismaService } from 'src/database/prisma.service';
import { MusicsRepository } from './musics.repository';
import { LogService } from 'src/common/log.service';
import { JwtService } from '@nestjs/jwt';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MusicSchema } from './schema/music.schema';

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
  controllers: [MusicsController],
  providers: [
    MusicsService,
    PrismaService,
    MusicsRepository,
    LogService,
    JwtService,
  ],
})
export class MusicsModule {}

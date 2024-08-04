import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { LogService } from './common/log.service';
import { validationSchema } from './config/validation-schema';
import { PrismaService } from './database/prisma.service';
import { DiaryModule } from './diaries/diary.module';
import { GenreModule } from './genres/genre.module';
import { UserModule } from './users/user.module';
import { MusicModule } from './musics/music.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GenreModule,
    DiaryModule,
    MusicModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, LogService],
})
export class AppModule {}

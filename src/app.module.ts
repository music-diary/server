import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { LogService } from './common/log.service';
import { validationSchema } from './config/validation-schema';
import { PrismaService } from './database/prisma.service';
import { DiariesModule } from './diaries/diary.module';
import { GenresModule } from './genres/genre.module';
import { UsersModule } from './users/users.module';
import { MusicsModule } from './musics/musics.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GenresModule,
    DiariesModule,
    MusicsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, LogService],
})
export class AppModule {}

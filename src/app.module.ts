import { AuthModule } from '@auth/auth.module';
import { validationSchema } from '@common/config/validation-schema';
import { DatabaseModule } from 'database/database.module';
import { PrismaService } from '@database/prisma/prisma.service';
import { LogService } from '@common/log.service';
import { DiaryModule } from '@diary/diary.module';
import { GenreModule } from '@genre/genre.module';
import { MusicModule } from '@music/music.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import { AppController } from 'app.controller';

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

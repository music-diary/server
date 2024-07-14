import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogService } from './common/log.service';
import { validationSchema } from './config/validation-schema';
import { PrismaService } from './database/prisma.service';
import { DiariesModule } from './diaries/diaries.module';
import { GenresModule } from './genres/genres.module';
import { UsersModule } from './users/users.module';
import { MusicsModule } from './musics/musics.module';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ validationSchema, isGlobal: true }),
    GenresModule,
    DiariesModule,
    MusicsModule,
    DynamooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        aws: {
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
          region: configService.get('AWS_REGION'),
        },
        local: false,
        table: {
          create: false,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LogService],
})
export class AppModule {}

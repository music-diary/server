import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { DynamodbModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ validationSchema, isGlobal: true }),
    GenresModule,
    DiariesModule,
    MusicsModule,
    DynamodbModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        region: config.get<string>('DYNAMODB_REGION'),
        endpoint: config.get<string>('DYNAMODB_ENDPOINT'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LogService],
})
export class AppModule {}

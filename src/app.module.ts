import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogService } from './common/log.service';
import { validationSchema } from './config/validation-schema';
import { PrismaService } from './database/prisma.service';
import { GenresModule } from './genres/genres.module';
import { GenresService } from './genres/genres.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ validationSchema, isGlobal: true }),
    GenresModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LogService, GenresService],
})
export class AppModule {}

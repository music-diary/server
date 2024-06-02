import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LogService } from './common/log.service';
import { validationSchema } from './config/validation-schema';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ validationSchema, isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LogService],
})
export class AppModule {}

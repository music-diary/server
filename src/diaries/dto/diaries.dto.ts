import { ApiProperty } from '@nestjs/swagger';
import {
  Diaries,
  DiariesStatus,
  DiaryEmotions,
  DiaryTopics,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EmotionsDto } from './emotions.dto';
import { TemplatesDto } from './templates.dto';
import { TopicsDto } from './topics.dto';
import { UsersDto } from '@user/dto/user.dto';
import { MusicsDto } from '@music/dto/musics.dto';

export class DiaryDto implements Diaries {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the diary',
    examples: [
      {
        content: '{"stop": "내용", "continue": "내용", "start": "내용"}',
      },
      {
        content: '템플릿 없는 경우, 일기 내용',
      },
    ],
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  templateId: string;

  @ApiProperty({
    type: 'enum',
    enum: DiariesStatus,
    description: 'The status of the diary',
  })
  @IsEnum(DiariesStatus)
  status: DiariesStatus;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  deletedAt: Date | null;

  @ApiProperty({ type: UsersDto })
  @IsOptional()
  @IsObject()
  @Type(() => UsersDto)
  users?: UsersDto;

  @ApiProperty({ type: TemplatesDto })
  @Type(() => TemplatesDto)
  @IsOptional()
  templates?: TemplatesDto;

  @ApiProperty({ type: TopicsDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => TopicsDto)
  topics?: DiaryTopics[];

  @ApiProperty({ type: EmotionsDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => EmotionsDto)
  emotions?: DiaryEmotions[];

  @ApiProperty({ type: MusicsDto })
  @IsOptional()
  @Type(() => MusicsDto)
  music?: MusicsDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role, Users, UserStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class UserPayload {
  id: string;
}

export class UsersDto implements Users {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @ApiProperty()
  @Type(() => String)
  @Matches(/^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]+$/, {
    message: 'The name must be Korean, English, number or space',
  })
  @MaxLength(6, { message: 'The name length must be less than 6' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  birthDay: Date;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsBoolean()
  isGenreSuggested: boolean;

  @ApiProperty()
  @IsBoolean()
  isAgreedMarketing: boolean;

  @ApiProperty()
  @IsNumber()
  useLimitCount: number;

  @ApiProperty()
  @IsBoolean()
  IsAgreedDiaryAlarm: boolean;

  @ApiProperty()
  @IsOptional()
  diaryAlarmTime: string | null;

  @ApiProperty({ type: Role, enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ type: UserStatus, enum: UserStatus })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  withdrawalsId: string | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  deletedAt: Date;
}

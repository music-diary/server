import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role, Users, UserStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
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
  @MaxLength(6, { message: 'The name length must be less than 6' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(4, null, { message: 'password must be less than 4' })
  password: string;

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
  @IsString()
  @IsOptional()
  profileImageKey: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profileImageUrl: string;

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

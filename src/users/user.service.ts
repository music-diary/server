import { LogService } from '@common/log.service';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DiariesStatus, Prisma, Users, UserStatus } from '@prisma/client';
import { UserRepository } from './user.repository';
import { GenreRepository } from '@genre/genre.repository';
import { WithdrawalReasonsRepository } from './withdrawal-reasons.repository';
import { ContactRepository } from './contact.repository';
import { StatisticRepository } from './statistic.repository';
import { PrismaService } from '@database/prisma/prisma.service';
import { SimpleEmailService } from '@service/simple-email/simple-email.service';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { CommonDto } from '@common/dto/common.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import {
  GetStatisticsQuery,
  GetStatisticsResponseDto,
  StatisticsType,
} from './dto/statistics.dto';
import {
  WithdrawalReasonsResponseDto,
  WithdrawUserBodyDto,
} from './dto/withdrawal.dto';
import { ContactResponseDto, SendContactBodyDto } from './dto/contact.dto';
import { MusicsDto } from '@music/dto/musics.dto';
import { GenresDto } from '@genre/dto/genres.dto';
import { DiaryDto } from '@diary/dto/diaries.dto';
import { RedisRepository } from '@database/redis.repository';
import { DiaryRepository } from '@diary/repository/diary.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly logService: LogService,
    private readonly userRepository: UserRepository,
    private readonly genreRepository: GenreRepository,
    private readonly withdrawalReasonsRepository: WithdrawalReasonsRepository,
    private readonly contactRepository: ContactRepository,
    private readonly statisticRepository: StatisticRepository,
    private readonly diaryRepository: DiaryRepository,
    private readonly prismaService: PrismaService,
    private readonly simpleEmailService: SimpleEmailService,
    private readonly redisRepository: RedisRepository,
  ) {}

  async findOne(id: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindUniqueArgs = {
      where: {
        id,
      },
    };
    const user = await this.userRepository.findUniqueOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logService.verbose(
      `Find user by id - ${user.id} ${user.name}`,
      UserService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'User find by id',
      user,
    };
  }

  async getMe(userId: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindUniqueArgs = {
      where: { id: userId },
      include: {
        genre: true,
      },
    };
    const user = await this.userRepository.findUniqueOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logService.verbose(`Get current user - ${userId}`, UserService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get current user',
      user,
    };
  }

  async delete(id: string): Promise<CommonDto> {
    const query = { where: { id } };
    const existedUser: Users = await this.userRepository.findUniqueOne(query);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(query);
    this.logService.verbose(`Delete user by id - ${id}`, UserService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted',
    };
  }

  async update(
    id: string,
    targetId: string,
    body: UpdateUserBodyDto,
  ): Promise<CommonDto> {
    this.checkPermission(id, targetId);

    const existUser = await this.userRepository.findUniqueOne({
      where: { id: targetId },
    });
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    if ('birthDay' in body && typeof body.birthDay === 'string') {
      const birthDayDate = new Date(body.birthDay);
      body.birthDay = birthDayDate;
    }
    if ('genres' in body && typeof body.genres !== undefined) {
      const genres = await this.genreRepository.findAll({
        where: {
          user: {
            some: { id: targetId },
          },
        },
      });
      await this.prismaService.users.update({
        where: { id: targetId },
        data: {
          genre: {
            disconnect: genres.map((genre) => ({ id: genre.id })),
            connect: body.genres.map((genre) => ({ id: genre.id })),
          },
        },
      });
    }
    const { genres: _genres, ...updateData } = body;
    const updateUserQuery: Prisma.UsersUpdateArgs = {
      where: { id: targetId },
      data: { ...updateData },
    };
    await this.userRepository.update(updateUserQuery);

    this.logService.verbose(`Update user - ${id}`, UserService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated',
    };
  }

  async findAll(): Promise<FindAllUsersResponseDto> {
    this.logService.verbose(`Get all users`, UserService.name);
    const users = await this.userRepository.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users find all',
      users,
    };
  }

  async getStatistics(
    userId: string,
    query: GetStatisticsQuery,
  ): Promise<GetStatisticsResponseDto> {
    const { type, ...restQuery } = query;
    let data: any;
    if (type === StatisticsType.MONTH) {
      const diaries = await this.getStatisticsByMonth(userId, restQuery.month);
      data = diaries;
    } else if (type === StatisticsType.YEAR) {
      data = await this.getStatisticsByYear(userId, restQuery.year);
    }
    this.logService.verbose(
      `Get statistics user - ${userId}`,
      UserService.name,
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Get statistics user`,
      data,
    };
  }

  async withdraw(
    id: string,
    targetId: string,
    body: WithdrawUserBodyDto,
  ): Promise<CommonDto> {
    this.checkPermission(id, targetId);

    const existUser = await this.userRepository.findUniqueOne({
      where: { id: targetId, status: UserStatus.ACTIVE },
    });
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    const { withdrawalReasonsId, ...updateData } = body;
    const createWithdrawalQuery: Prisma.UsersUpdateArgs = {
      where: { id: targetId },
      data: {
        withdrawals: { create: { withdrawalReasonsId } },
        deletedAt: new Date(),
        status: UserStatus.DEACTIVE,
      },
    };
    const withdrawalReasonsOther =
      await this.withdrawalReasonsRepository.findUnique({
        where: { id: withdrawalReasonsId },
      });
    if (withdrawalReasonsOther.name === 'OTHER' && updateData.content) {
      createWithdrawalQuery.data.withdrawals.update = {
        data: { content: updateData.content },
      };
    }
    const key = `signUp:${existUser.phoneNumber}`;
    await this.redisRepository.del(key);
    await this.userRepository.update(createWithdrawalQuery);

    this.logService.verbose(`Withdraw user - ${id}`, UserService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User withdraw',
    };
  }

  async findWithdrawReasons(): Promise<WithdrawalReasonsResponseDto> {
    const withdrawalReasons = await this.withdrawalReasonsRepository.findAll();
    this.logService.verbose(`find Withdrawal Reasons`, UserService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Find Withdrawal Reasons',
      withdrawalReasons,
    };
  }

  async sendContact(
    userId: string,
    body: SendContactBodyDto,
  ): Promise<CommonDto> {
    const { senderEmail, contactTypeId, message } = body;
    const contactType = await this.contactRepository.findContactTypeById({
      where: { id: contactTypeId },
    });
    if (!contactType) {
      throw new NotFoundException('Contact type not found');
    }
    await this.simpleEmailService.sendContactEmail(
      senderEmail,
      contactType,
      message,
    );
    const contactHistory = { userId, typeId: contactTypeId, content: message };
    await this.contactRepository.createContactHistories({
      data: contactHistory,
    });

    this.logService.verbose(`Send contact message`, UserService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Send contact message',
    };
  }

  async findContactTypes(): Promise<ContactResponseDto> {
    const contactTypes = await this.contactRepository.findContactTypes();
    this.logService.verbose(`find Contact Types`, UserService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Find Contact Types',
      contactTypes,
    };
  }

  private checkPermission(userId: string, targetId: string): boolean {
    if (userId !== targetId) {
      throw new ForbiddenException('Forbidden resource');
    }
    return;
  }

  private async getStatisticsByMonth(
    userId: string,
    date: string,
  ): Promise<any> {
    const { startDate, endDate } = this.parseDate(date);
    const whereQuery = {
      where: {
        userId,
        updatedAt: { gte: startDate, lt: endDate },
      },
    };
    const whereDiaryQuery = {
      where: {
        ...whereQuery.where,
        status: DiariesStatus.DONE,
        deletedAt: null,
      },
    };
    const diaryCount = await this.diaryRepository.count(whereDiaryQuery);

    const emotions = await this.statisticRepository.getEmotionStatistic({
      diary: { status: DiariesStatus.DONE, deletedAt: null },
      ...whereQuery.where,
    });

    const musics = await this.statisticRepository.findMusicsStatistic({
      where: { selected: true, ...whereQuery.where },
      select: { id: true, originalGenre: true },
    });
    const genres = await this.statisticRepository.findGenres();
    const genreCounts = this.getGenreCount(genres, musics);

    const topics = await this.statisticRepository.findTopicsStatistic({
      diary: { status: DiariesStatus.DONE, deletedAt: null },
      ...whereQuery.where,
    });
    return { date, diaryCount, emotions, genreCounts, topics };
  }

  private async getStatisticsByYear(
    userId: string,
    year: number,
  ): Promise<any> {
    const { startDate, endDate } = this.parseYear(+year);
    const whereQuery = {
      where: {
        userId,
        updatedAt: { gte: startDate, lt: endDate },
      },
    };
    const whereDiaryQuery = {
      where: {
        ...whereQuery.where,
        status: DiariesStatus.DONE,
        deletedAt: null,
      },
    };
    const allDiaries = await this.diaryRepository.findAll({
      distinct: ['updatedAt'],
      select: { updatedAt: true },
      ...whereDiaryQuery,
    });

    const diaries = await this.getYearlyDiariesCount(
      userId,
      allDiaries,
      startDate,
      endDate,
    );

    const emotions = await this.statisticRepository.getEmotionStatistic({
      diary: { status: DiariesStatus.DONE, deletedAt: null },
      ...whereQuery.where,
    });

    const musics = await this.statisticRepository.findMusicsStatistic({
      where: { selected: true, ...whereQuery.where },
      select: { id: true, originalGenre: true },
    });
    const genres = await this.statisticRepository.findGenres();
    const genreCounts = this.getGenreCount(genres, musics);

    const topics = await this.statisticRepository.findTopicsStatistic({
      diary: { status: DiariesStatus.DONE, deletedAt: null },
      ...whereQuery.where,
    });
    return { year, diaries, emotions, genreCounts, topics };
  }

  private getGenreCount(
    genres: GenresDto[],
    musics: MusicsDto[],
  ): { genre: string; count: number }[] {
    return genres.reduce((acc, genre) => {
      const count = musics.reduce((genreCount, music) => {
        const originalGenre = music?.originalGenre || null;
        const originalGenreFirst = originalGenre.includes(',')
          ? originalGenre.split(',')[0]
          : originalGenre;
        if (music.originalGenre && originalGenreFirst.includes(genre.label)) {
          return genreCount + 1;
        }
        return genreCount;
      }, 0);

      if (count > 0) {
        acc.push({
          genre: genre.name,
          count,
        });
      }
      return acc;
    }, []);
  }

  private async getYearlyDiariesCount(
    userId: string,
    diaries: DiaryDto[],
    startDate: Date,
    _endDate: Date,
  ): Promise<any> {
    const uniqueYears = Array.from(
      new Set(diaries.map((diary) => diary.updatedAt.getFullYear())),
    );

    return await Promise.all(
      uniqueYears.map(async (year) => {
        const yearDiaryCount = await this.diaryRepository.count({
          where: {
            userId,
            updatedAt: {
              gte: startDate,
              lt: new Date(startDate.getFullYear() + 1, 0, 1),
            },
            status: DiariesStatus.DONE,
            deletedAt: null,
          },
        });

        // To get the timezone offset in hours
        const offset = parseInt(
          `${(new Date().getTimezoneOffset() * -1) / 60}`,
        );

        // Get the count of diaries for each month in the year
        const monthDiaryCounts = await Promise.all(
          Array.from({ length: 12 }, async (_, monthIndex) => {
            const monthStart = new Date(year, monthIndex, 1, offset); // First day of the month
            const monthEnd = new Date(year, monthIndex + 1, 0, offset); // Last day of the month

            const monthCount = await this.diaryRepository.count({
              where: {
                userId,
                status: DiariesStatus.DONE,
                updatedAt: {
                  gte: monthStart,
                  lt: new Date(
                    monthStart.getFullYear(),
                    monthStart.getMonth() + 1,
                    1,
                  ),
                },
                deletedAt: null,
              },
            });

            return {
              month: monthStart.toISOString().substring(0, 7),
              count: monthCount,
            };
          }),
        );

        return {
          year,
          count: yearDiaryCount,
          months: monthDiaryCounts,
        };
      }),
    );
  }

  private parseDate(date: string): { startDate: string; endDate: string } {
    const startDate = new Date(date).toISOString();
    const endDate = new Date(date);
    endDate.setMonth(endDate.getMonth() + 1);
    return { startDate, endDate: endDate.toISOString() };
  }

  private parseYear(year: number): { startDate: Date; endDate: Date } {
    const startDate = new Date(`${year}-01-01`);
    // To get the timezone offset in hours
    const offset = parseInt(`${(new Date().getTimezoneOffset() * -1) / 60}`);
    const endDate = new Date(startDate.getFullYear() + 1, 0, 1, offset);
    return { startDate, endDate };
  }
}

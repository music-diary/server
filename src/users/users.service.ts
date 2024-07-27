import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Users, UserStatus } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { LogService } from 'src/common/log.service';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UsersRepository } from './users.repository';
import { GenresRepository } from 'src/genres/genres.repository';
import {
  WithdrawalReasonsResponseDto,
  WithdrawUserBodyDto,
} from './dto/withdrawal.dto';
import { WithdrawalReasonsRepository } from './withdrawal-reasons.repository';
import { ContactResponseDto, SendContactBodyDto } from './dto/contact.dto';
import { SimpleEmailService } from '../simple-email/simple-email.service';
import { ContactRepository } from './contact.repository';
import {
  GetStatisticsQuery,
  GetStatisticsResponseDto,
  StatisticsType,
} from './dto/statistics.dto';
import { StatisticRepository } from './statistic.repository';
import { DiaryDto } from 'src/diaries/dto/diaries.dto';
import { GenresDto } from 'src/genres/dto/genres.dto';
import { MusicsDto } from 'src/musics/dto/musics.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly logService: LogService,
    private readonly usersRepository: UsersRepository,
    private readonly genresRepository: GenresRepository,
    private readonly withdrawalReasonsRepository: WithdrawalReasonsRepository,
    private readonly contactRepository: ContactRepository,
    private readonly statisticRepository: StatisticRepository,
    private readonly simpleEmailService: SimpleEmailService,
  ) {}

  async findOne(id: string): Promise<FindUserResponseDto> {
    const query: Prisma.UsersFindUniqueArgs = {
      where: {
        id,
      },
    };
    const user = await this.usersRepository.findUniqueOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logService.verbose(
      `Find user by id - ${user.id} ${user.name}`,
      UsersService.name,
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
    const user = await this.usersRepository.findUniqueOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logService.verbose(`Get current user - ${userId}`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get current user',
      user,
    };
  }

  async delete(id: string): Promise<CommonDto> {
    const query = { where: { id } };
    const existedUser: Users = await this.usersRepository.findUniqueOne(query);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(query);
    this.logService.verbose(`Delete user by id - ${id}`, UsersService.name);
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

    const existUser = await this.usersRepository.findUniqueOne({
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
      const genres = await this.genresRepository.findAll({
        where: {
          user: {
            some: { id: targetId },
          },
        },
      });
      genres.map(async (genre) => {
        await this.usersRepository.update({
          where: { id: targetId },
          data: {
            genre: {
              disconnect: {
                id: genre.id,
              },
            },
          },
        });
      });
      body.genres.map(async (genre) => {
        await this.usersRepository.update({
          where: { id: targetId },
          data: {
            genre: {
              connect: { id: genre.id },
            },
          },
        });
      });
    }
    const { genres: _genres, ...updateData } = body;
    const updateUserQuery: Prisma.UsersUpdateArgs = {
      where: { id: targetId },
      data: { ...updateData },
    };
    await this.usersRepository.update(updateUserQuery);

    this.logService.verbose(`Update user - ${id}`, UsersService.name);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated',
    };
  }

  async findAll(): Promise<FindAllUsersResponseDto> {
    this.logService.verbose(`Get all users`, UsersService.name);
    const users = await this.usersRepository.findAll();
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
      UsersService.name,
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

    const existUser = await this.usersRepository.findUniqueOne({
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
    await this.usersRepository.update(createWithdrawalQuery);

    this.logService.verbose(`Withdraw user - ${id}`, UsersService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User withdraw',
    };
  }

  async findWithdrawReasons(): Promise<WithdrawalReasonsResponseDto> {
    const withdrawalReasons = await this.withdrawalReasonsRepository.findAll();
    this.logService.verbose(`find Withdrawal Reasons`, UsersService.name);
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

    this.logService.verbose(`Send contact message`, UsersService.name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Send contact message',
    };
  }

  async findContactTypes(): Promise<ContactResponseDto> {
    const contactTypes = await this.contactRepository.findContactTypes();
    this.logService.verbose(`find Contact Types`, UsersService.name);
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
      where: { userId, createdAt: { gte: startDate, lt: endDate } },
    };
    const diaryCount =
      await this.statisticRepository.getMonthlyDiaryCount(whereQuery);
    // NOTE: This is not used (월별 일기 작성 비율)
    // const daysInMonth = new Date(
    //   startDate.getFullYear(),
    //   startDate.getMonth() + 1,
    //   0,
    // ).getDate();
    // const diaryCountRatio = ((diaryCount / daysInMonth) * 100).toFixed(0);
    const emotions = await this.statisticRepository.getEmotionStatistic(
      whereQuery.where,
    );

    const musics = await this.statisticRepository.findMusicsStatistic({
      where: { selected: true, ...whereQuery.where },
      select: { id: true, originalGenre: true },
    });
    const genres = await this.statisticRepository.findGenres();
    const genreCounts = this.getGenreCount(genres, musics);

    const topics = await this.statisticRepository.findTopicsStatistic(
      whereQuery.where,
    );
    return { date, diaryCount, emotions, genreCounts, topics };
  }

  private async getStatisticsByYear(
    userId: string,
    year: number,
  ): Promise<any> {
    const { startDate, endDate } = this.parseYear(+year);
    console.log(startDate, endDate);
    const whereQuery = {
      where: { userId, createdAt: { gte: startDate, lt: endDate } },
    };
    const allDiaries = await this.statisticRepository.getDiaries({
      distinct: ['createdAt'],
      select: { createdAt: true },
      ...whereQuery,
    });
    console.log(allDiaries);

    const diaries = await this.getYearlyDiariesCount(
      allDiaries,
      startDate,
      endDate,
    );

    // NOTE: This is not used (월별 일기 작성 비율)
    // const daysInMonth = new Date(
    //   startDate.getFullYear(),
    //   startDate.getMonth() + 1,
    //   0,
    // ).getDate();
    // const diaryCountRatio = ((diaryCount / daysInMonth) * 100).toFixed(0);
    const emotions = await this.statisticRepository.getEmotionStatistic(
      whereQuery.where,
    );

    const musics = await this.statisticRepository.findMusicsStatistic({
      where: { selected: true, ...whereQuery.where },
      select: { id: true, originalGenre: true },
    });
    const genres = await this.statisticRepository.findGenres();
    const genreCounts = this.getGenreCount(genres, musics);

    const topics = await this.statisticRepository.findTopicsStatistic(
      whereQuery.where,
    );
    return { year, diaries, emotions, genreCounts, topics };
  }

  private getGenreCount(
    genres: GenresDto[],
    musics: MusicsDto[],
  ): { genre: string; count: number }[] {
    return genres.reduce((acc, genre) => {
      const count = musics.reduce((genreCount, music) => {
        if (music.originalGenre && music.originalGenre.includes(genre.label)) {
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
    diaries: DiaryDto[],
    startDate: Date,
    _endDate: Date,
  ): Promise<any> {
    const uniqueYears = Array.from(
      new Set(diaries.map((diary) => diary.createdAt.getFullYear())),
    );

    return await Promise.all(
      uniqueYears.map(async (year) => {
        const yearDiaryCount =
          await this.statisticRepository.getYearlyDiariesCount({
            where: {
              createdAt: {
                gte: startDate,
                lt: new Date(startDate.getFullYear() + 1, 0, 1),
              },
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
            console.log(year, monthStart, monthEnd);

            const monthCount =
              await this.statisticRepository.getMonthlyDiaryCount({
                where: {
                  createdAt: {
                    gte: monthStart,
                    lt: new Date(
                      monthStart.getFullYear(),
                      monthStart.getMonth() + 1,
                      1,
                    ),
                  },
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

  private parseDate(date: string): { startDate: Date; endDate: Date } {
    const [year, month] = date.split('-');
    const startDate = new Date(+year, +month - 1, 1);
    // TODO: Check if this is correct (offset?)
    const endDate = new Date(+year, +month, 1);
    return { startDate, endDate };
  }

  private parseYear(year: number): { startDate: Date; endDate: Date } {
    const startDate = new Date(`${year}-01-01`);
    // To get the timezone offset in hours
    const offset = parseInt(`${(new Date().getTimezoneOffset() * -1) / 60}`);
    const endDate = new Date(startDate.getFullYear() + 1, 0, 1, offset);
    return { startDate, endDate };
  }
}

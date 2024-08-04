import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { WithdrawReasonDto } from './dto/withdrawal.dto';

@Injectable()
export class WithdrawalReasonsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    query?: Prisma.WithdrawalReasonsFindManyArgs,
  ): Promise<WithdrawReasonDto[]> {
    return await this.prismaService.withdrawalReasons.findMany(query);
  }

  async findUnique(
    query?: Prisma.WithdrawalReasonsFindUniqueArgs,
  ): Promise<WithdrawReasonDto> {
    return await this.prismaService.withdrawalReasons.findUnique(query);
  }
}

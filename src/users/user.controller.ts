import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CommonDto } from '@common/dto/common.dto';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UserPayload } from './dto/user.dto';
import { UserService } from './user.service';
import {
  WithdrawalReasonsResponseDto,
  WithdrawUserBodyDto,
} from './dto/withdrawal.dto';
import { ContactResponseDto, SendContactBodyDto } from './dto/contact.dto';
import {
  GetStatisticsQuery,
  GetStatisticsResponseDto,
} from './dto/statistics.dto';
import { AuthGuard } from '@common/guards/auth.guard';
import { User } from '@common/decorator/user.decorator';
import { RolesGuard } from '@common/guards/role.guard';
import { Roles } from '@common/decorator/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  getSelf(@User() user: UserPayload): Promise<FindUserResponseDto> {
    return this.userService.getMe(user.id);
  }

  @ApiOperation({ summary: 'Update user info' })
  @ApiBody({ type: UpdateUserBodyDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: UserPayload,
    @Body() body: UpdateUserBodyDto,
  ): Promise<CommonDto> {
    return this.userService.update(user.id, id, body);
  }

  @ApiOperation({ summary: '[Dev] Delete user' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<CommonDto> {
    return this.userService.delete(id);
  }

  @ApiOperation({ summary: 'Get Withdraw Reasons' })
  @Get('withdrawal')
  findWithdrawReasons(): Promise<WithdrawalReasonsResponseDto> {
    return this.userService.findWithdrawReasons();
  }

  @ApiOperation({ summary: 'find contact types' })
  @Get('contact')
  findContactTypes(): Promise<ContactResponseDto> {
    return this.userService.findContactTypes();
  }

  @ApiOperation({ summary: 'send contact' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('contact')
  sendContact(
    @User() user: UserPayload,
    @Body() body: SendContactBodyDto,
  ): Promise<CommonDto> {
    return this.userService.sendContact(user.id, body);
  }

  @ApiOperation({ summary: 'Withdraw user' })
  @ApiBody({ type: WithdrawUserBodyDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id/withdrawal')
  withdraw(
    @Param('id') id: string,
    @User() user: UserPayload,
    @Body() body: WithdrawUserBodyDto,
  ): Promise<CommonDto> {
    return this.userService.withdraw(user.id, id, body);
  }

  @ApiOperation({ summary: 'Get statistics in my page' })
  @ApiQuery({
    name: 'type',
    required: true,
    type: 'enum',
    enum: ['month', 'year'],
  })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('statistics')
  getStatistics(
    @Query() query: GetStatisticsQuery,
    @User() user: UserPayload,
  ): Promise<GetStatisticsResponseDto> {
    return this.userService.getStatistics(user.id, query);
  }

  @ApiOperation({ summary: '[ADMIN] get all users' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Get()
  findAll(): Promise<FindAllUsersResponseDto> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '[ADMIN] get user by id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FindUserResponseDto> {
    return this.userService.findOne(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { FindAllUsersResponseDto, FindUserResponseDto } from './dto/find.dto';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UserPayload } from './dto/user.dto';
import { UsersService } from './users.service';
import {
  WithdrawalReasonsResponseDto,
  WithdrawUserBodyDto,
} from './dto/withdrawal.dto';
import { ContactResponseDto, SendContactBodyDto } from './dto/contact.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  getSelf(@User() user: UserPayload): Promise<FindUserResponseDto> {
    return this.usersService.getMe(user.id);
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
    return this.usersService.update(user.id, id, body);
  }

  @ApiOperation({ summary: '[Dev] Delete user' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<CommonDto> {
    return this.usersService.delete(id);
  }

  @ApiOperation({ summary: 'Get Withdraw Reasons' })
  @Get('withdrawal')
  findWithdrawReasons(): Promise<WithdrawalReasonsResponseDto> {
    return this.usersService.findWithdrawReasons();
  }

  @ApiOperation({ summary: 'find contact types' })
  @Get('contact')
  findContactTypes(): Promise<ContactResponseDto> {
    return this.usersService.findContactTypes();
  }

  @ApiOperation({ summary: 'send contact' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('contact')
  sendContact(
    @User() user: UserPayload,
    @Body() body: SendContactBodyDto,
  ): Promise<CommonDto> {
    return this.usersService.sendContact(user.id, body);
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
    return this.usersService.withdraw(user.id, id, body);
  }

  @ApiOperation({ summary: '[ADMIN] get all users' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Get()
  findAll(): Promise<FindAllUsersResponseDto> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: '[ADMIN] get user by id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FindUserResponseDto> {
    return this.usersService.findOne(id);
  }
}

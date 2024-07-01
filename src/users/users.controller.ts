import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

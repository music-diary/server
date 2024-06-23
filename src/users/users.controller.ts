import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CommonDto } from 'src/common/common.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { UpdateUserBodyDto } from './dto/update.dto';
import { UserPayload } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get self user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('self')
  getSelf(@User() user: UserPayload) {
    return this.usersService.getSelf(user.id);
  }

  @ApiOperation({ summary: 'Update user info' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserBodyDto,
  ): Promise<CommonDto> {
    return this.usersService.update(id, body);
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
  getAll(): Promise<CommonDto> {
    return this.usersService.getAll();
  }

  @ApiOperation({ summary: '[ADMIN] get user by id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Get(':id')
  getUser(@Param('id') id: string): Promise<CommonDto> {
    return this.usersService.getUser(id);
  }
}

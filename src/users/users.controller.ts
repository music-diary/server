import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonDto } from 'src/common/common.dto';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
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

  @ApiOperation({ summary: '[Dev] Delete user' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<CommonDto> {
    return this.usersService.delete(id);
  }
}

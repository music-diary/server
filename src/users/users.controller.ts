import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto } from './dto/create.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.usersService.create(body);
  }
}

import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto, CreateUserResponseDto } from './dto/create.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserResponseDto,
    headers: {
      Authorization: {
        description: 'The access token',
        schema: {
          type: 'string',
          example: 'access-token=<jwt-token>',
        },
      },
    },
  })
  @Post()
  async create(
    @Body() body: CreateUserDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.usersService.create(body);
    const { token, ...data } = result;
    response.header('Authorization', `access-token=${token}`);
    response.send(data);
    return;
  }
}

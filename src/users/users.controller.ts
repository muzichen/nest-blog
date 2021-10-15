import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import CreateUserDto from './create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  async getAll(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Post('new')
  async create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getInfo(@Req() req: RequestWithUser): Promise<User | undefined> {
    return req.user;
  }
}

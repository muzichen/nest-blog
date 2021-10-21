import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import RolesGuard from 'src/auth/roles.guard';
import CreateUserDto from './create-user.dto';
import { User } from './user.schema';
// import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('')
  async getAll(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Post('new')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('info')
  async getInfo(@Req() req: RequestWithUser): Promise<User | undefined> {
    return req.user;
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
// import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import RegisterUserDto from './register-user.dto';
import RequestWithUser from './requestWithUser.interface';
import ILoginUser from './loginUserInterface';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenGuard } from './refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerData: RegisterUserDto) {
    return this.authService.createUser(registerData);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  // @UseInterceptors(MongooseInterceptor(UserWithToken))
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<ILoginUser> {
    // 当local strategy验证过后会把validate的返回数据放到request对象上
    const user = req.user.toJSON();
    const token = await this.authService.createJwt({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    });
    // 登录过程中同时生成一个新的refreshToken并存储到数据库中
    const refreshToken = await this.authService.createRefreshToken({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    });
    this.usersService.updateUserRefreshToken(refreshToken, user._id);
    delete user.password;
    return { user, token, refreshToken };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@Req() req: RequestWithUser): Promise<void> {
    const user = req.user;
    const accessToken = this.authService.createJwt({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    });
    // return { user, acce }
  }
}

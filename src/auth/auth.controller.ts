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
import { LoginUser, RefreshUser } from './loginUserInterface';
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
  async login(@Req() req: RequestWithUser): Promise<LoginUser> {
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

  /**
   * https://www.rfc-editor.org/rfc/rfc6749#section-1.5
   * @param req Request
   * @returns RefreshUser
   */
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(@Req() req: RequestWithUser): Promise<RefreshUser> {
    const user = req.user.toJSON(); // refreshToken验证通过后会讲返回的user对象放到request对象上
    const accessToken = await this.authService.createJwt({
      _id: user._id,
      email: user.email,
      userName: user.userName,
    }); // 重新生成新的accessToken
    delete user.password;
    delete user.currentHashedRefreshToken;
    return { user, token: accessToken };
  }
}

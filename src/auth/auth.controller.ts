import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
// import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import RegisterUserDto from './register-user.dto';
import RequestWithUser from './requestWithUser.interface';
import ILoginUser from './loginUserInterface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterUserDto) {
    return this.authService.createUser(registerData);
  }

  @UseGuards(LocalAuthGuard)
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
    delete user.password;
    return { user, token };
  }
}

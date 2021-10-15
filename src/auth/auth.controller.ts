import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import RegisterUserDto from './register-user.dto';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterUserDto) {
    return this.authService.createUser(registerData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<User> {
    // 当local strategy验证过后会把validate的返回数据放到request对象上
    const user = req.user;
    // local stratery 验证了用户名和密码是否匹配，这里生存jwt返回给客户端
    // return classToPlain(user);
    return user;
  }
}

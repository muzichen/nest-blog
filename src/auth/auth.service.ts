import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import LoginUserDto from './login-user.dto';
import RegisterUserDto from './register-user.dto';

import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.schema';
import { ConfigService } from '@nestjs/config';
// import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(registerUserData: RegisterUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(registerUserData.password, salt);
    const user = await this.usersService.create({
      ...registerUserData,
      password: hashPassword,
    });
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (user && isPasswordValid) {
      return user;
    }
    return null;
  }

  async createJwt(loginUserDto: LoginUserDto): Promise<string> {
    return this.jwtService.sign(loginUserDto);
  }

  async createRefreshToken(loginUserDto: LoginUserDto): Promise<string> {
    return this.jwtService.sign(loginUserDto, {
      secret: this.configService.get('REFRESH_SECRET'),
      expiresIn: this.configService.get('REFRESH_EXPIRATION'),
    });
  }
}

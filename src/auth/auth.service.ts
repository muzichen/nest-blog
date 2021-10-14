import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import LoginUserDto from './login-user.dto';
import RegisterUserDto from './register-user.dto';

import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    registerUserData: RegisterUserDto,
  ): Promise<UserDocument | undefined> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(registerUserData.password, salt);
    const user = this.usersService.create({
      ...registerUserData,
      salt,
      password: hashPassword,
    });
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async createJwt(loginUserDto: LoginUserDto) {
    return this.jwtService.sign(loginUserDto);
  }
}

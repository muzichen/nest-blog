import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import LoginUserDto from './login-user.dto';
import RegisterUserDto from './register-user.dto';

import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/user.schema';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    registerUserData: RegisterUserDto,
  ): Promise<User | undefined> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(registerUserData.password, salt);
    const user = this.usersService.create({
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

  async createJwt(loginUserDto: LoginUserDto) {
    return this.jwtService.sign(loginUserDto);
  }
}

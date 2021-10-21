import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import TokenPlayload from './tokenPlayload.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: configService.get('REFRESH_SECRET'),
      passReqToCallback: true, // If true the request will be passed to the verify callback
    });
    console.log(123);
  }

  async validate(request: Request, payload: TokenPlayload): Promise<User> {
    const refreshToken = request.body?.refresh_token; // 从body中拿到refresh_token
    console.log(refreshToken);
    if (!refreshToken) return null;
    return this.usersService.getUserIfRefreshTokenIsValid(
      refreshToken,
      payload.id,
    ); // 如果refresh_token与当前用户数据库中存储的refresh_token相同的话，则验证通过
  }
}

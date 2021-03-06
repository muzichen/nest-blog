import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/user.schema';
// import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import TokenPlayload from './tokenPlayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPlayload): Promise<User> {
    // Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.
    return this.userService.findByEmail(payload.email);
  }
}

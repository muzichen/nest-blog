import { IsString } from 'class-validator';

export default class UserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;
}

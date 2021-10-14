import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  readonly userName: string;
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}

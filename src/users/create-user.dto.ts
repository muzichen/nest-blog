import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  salt: string;

  @IsBoolean()
  isAdmin?: boolean;
}

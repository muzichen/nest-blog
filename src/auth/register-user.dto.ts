import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export default class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, 16)
  password: string;
  @IsNotEmpty()
  @IsString()
  userName: string;
}

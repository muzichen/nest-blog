import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export default class LoginUserDto {
  @IsNotEmpty()
  _id: ObjectId;
  @IsNotEmpty()
  @IsString()
  readonly userName: string;
  @IsNotEmpty()
  @IsString()
  readonly email: string;
}

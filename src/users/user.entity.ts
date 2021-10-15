import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';
import { Column, ObjectID, ObjectIdColumn } from 'typeorm';

export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @IsString()
  userName: string;

  @Column()
  @IsString()
  @Length(8, 16)
  password: string;

  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @IsBoolean()
  isAdmin: boolean;
}

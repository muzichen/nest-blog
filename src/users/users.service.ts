import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { ObjectID, Repository } from 'typeorm';
import CreateUserDto from './create-user.dto';
import { User } from './user.entity';
// import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  // constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // const newUser = new this.userModel(createUserDto);
    const newUser = new User();
    const { userName, password, email } = createUserDto;
    newUser.userName = userName;
    newUser.password = password;
    newUser.email = email;
    return await this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
}

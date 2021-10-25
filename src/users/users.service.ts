import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './create-user.dto';
// import { User } from './user.entity';
import { User, UserDocument } from './user.schema';
import { MongooseInterceptor } from 'src/mongoose.interceptor';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  @UseInterceptors(MongooseInterceptor(User))
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findOne({ id });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async updateUserRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.updateOne(
      { _id: userId },
      { currentHashedRefreshToken: hashedRefreshToken },
    );
  }
  /**
   * 判断refreshToken与当前用户存储的refreshToken是否匹配
   * @param refreshToken string
   * @param userId string
   * @returns User
   */
  async getUserIfRefreshTokenIsValid(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenValid) return user;
  }
}

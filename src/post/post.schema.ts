import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import * as mongoose from 'mongoose';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
})
export class Post {
  // 文章标题
  @Prop({
    required: true,
  })
  title: string;
  // 文章内容
  @Prop()
  content: string;
  // 文章标签
  @Prop()
  tags: string[];
  // 文章作者
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { Post } from 'src/post/post.schema';

export type CommentDocument = Comment & mongoose.Document;

export class CommentAuthor {
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  site: string;
}

@Schema({
  timestamps: true,
})
export class Comment extends mongoose.Document {
  // 评论的文章
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Post.name,
  })
  post: string;
  // 评论内容
  @Prop({
    required: true,
  })
  content: string;
  // 层级path
  @Prop()
  path: string[];

  @Prop()
  author: CommentAuthor;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

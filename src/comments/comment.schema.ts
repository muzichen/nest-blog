import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

export class CommentAuthor {
  name: string;
  email: string;
  site: string;
}

@Schema({
  timestamps: true,
})
export class Comment extends Document {
  // 评论的文章
  @Prop({
    required: true,
  })
  post_id: string;
  // 评论内容
  @Prop({
    required: true,
  })
  content: string;
  // 层级path
  @Prop()
  path: string;

  @Prop()
  author: CommentAuthor;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

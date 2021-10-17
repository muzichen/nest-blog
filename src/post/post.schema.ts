import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import * as mongoose from 'mongoose';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
})
export class Post {
  @Prop({
    required: true,
  })
  title: string;

  @Prop()
  content: string;

  @Prop()
  tags: [string];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);

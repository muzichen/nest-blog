import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;
@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  userName: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Exclude()
  @Prop()
  currentHashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

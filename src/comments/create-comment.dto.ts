import { IsString } from 'class-validator';
import { CommentAuthor } from './comment.schema';

export default class CreateCommentDto {
  @IsString()
  post: string;
  @IsString()
  content: string;
  @IsString()
  path: string;
  author: CommentAuthor;
}

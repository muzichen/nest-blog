import { IsString } from 'class-validator';

export default class FilterCommentDto {
  @IsString()
  postId?: string;
}

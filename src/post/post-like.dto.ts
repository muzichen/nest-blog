import { IsString } from 'class-validator';

export default class PostLikeDto {
  @IsString()
  post_id: string;
}

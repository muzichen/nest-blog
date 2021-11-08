import { Post } from './post.schema';

export interface PostWithComments extends Post {
  commentsCount: number;
}

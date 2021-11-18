import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { CommentsService } from 'src/comments/comments.service';
import { User } from 'src/users/user.schema';
import CreatePostDto from './create-post.dto';
import GetPostsDto from './get-posts.dto';
import PostLikeDto from './post-like.dto';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: PaginateModel<PostDocument>,
    private commentsService: CommentsService,
  ) {}

  async getPosts({
    currentPage = 1,
    pageSize = 10,
    tag,
  }: GetPostsDto): Promise<PaginateResult<PostDocument>> {
    try {
      // const posts = await this.postModel
      //   .find()
      //   .sort({
      //     createdAt: -1,
      //   })
      //   .skip(currentPage > 0 ? (currentPage - 1) * pageSize : 0) // 使用skip对性能会有影响 https://docs.mongodb.com/manual/reference/method/cursor.skip/#cursor.skip
      //   .limit(pageSize)
      //   .populate('author', 'userName');
      // console.log(posts);
      const query: Record<string, unknown> = {};
      if (tag) query.tags = tag;
      const posts = await this.postModel.paginate(query, {
        limit: pageSize,
        page: currentPage,
        populate: {
          path: 'author',
          select: 'userName',
        },
      });
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  }

  async createPost(createPostDdo: CreatePostDto, author: User): Promise<Post> {
    const newPost = await this.postModel.create({
      ...createPostDdo,
      author,
    });
    return newPost.save();
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'userName');
    if (!post) {
      throw new NotFoundException('No post found.');
    }
    return post;
  }

  async postLike({ post_id }: PostLikeDto): Promise<Post> {
    console.log(post_id);
    const post = await this.postModel.findById(post_id);
    if (!post) {
      throw new NotFoundException(`${post_id} post not found`);
    }
    if (!post.likes) post.likes = 0;
    post.likes += 1;
    return post.save();
  }

  // async editPost(createPostDdo: CreatePostDto): Promise<Post> {

  // }
}

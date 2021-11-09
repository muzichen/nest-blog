import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsService } from 'src/comments/comments.service';
import { User } from 'src/users/user.schema';
import CreatePostDto from './create-post.dto';
import { Post, PostDocument } from './post.schema';
import { PostWithComments } from './types';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private commentsService: CommentsService,
  ) {}

  async getAllPosts(): Promise<PostWithComments[]> {
    try {
      const posts = await this.postModel
        .find()
        .sort({
          createdAt: -1,
        })
        .populate('author', 'userName');
      return Promise.all(
        posts.map(async (post) => {
          const commentsCount = await this.commentsService.getCommentsCount({
            postId: post._id,
          });
          return { ...post.toObject(), commentsCount };
        }),
      );
      // return posts;
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
    const post = this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('No post found.');
    }
    return post;
  }

  // async editPost(createPostDdo: CreatePostDto): Promise<Post> {

  // }
}

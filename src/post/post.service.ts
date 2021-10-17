import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import CreatePostDto from './create-post.dto';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAllPosts(): Promise<Post[]> {
    try {
      const posts = await this.postModel.find().sort({
        createdAt: -1,
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
    const post = this.postModel.findById(id);
    return post;
  }

  // async editPost(createPostDdo: CreatePostDto): Promise<Post> {

  // }
}

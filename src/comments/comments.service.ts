import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import CreateCommentDto from './create-comment.dto';
import FilterCommentDto from './filter-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getComments({ postId }: FilterCommentDto): Promise<Comment[]> {
    return await this.commentModel.find({
      post_id: postId,
    });
  }

  async getCommentsCount({ postId }: FilterCommentDto): Promise<number> {
    return await this.commentModel.count({
      post_id: postId,
    });
  }
  /**
   * 查询postId对应的所有评论
   * @param postId
   * @returns
   */
  // async getCommentsByPostId(postId: string): Promise<Comment[]> {
  //   return await this.commentModel.find({
  //     post_id: postId,
  //   });
  // }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const newComment = await this.commentModel.create(createCommentDto);
    return newComment.save();
  }
}

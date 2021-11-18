import { Injectable, NotFoundException } from '@nestjs/common';
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

  // private formatCommentsTree(comments: Comment[]): void {
  //   comments.forEach((comment) => {
  //     const pt = comment.path.split(',');
  //     if (pt.length > 1) {
  //       // 说明是回复
  //       // const parentComment =
  //     }
  //   });
  // }

  async getComments({ postId }: FilterCommentDto): Promise<Comment[]> {
    const comments = await this.commentModel.find({
      post: postId,
    });

    return comments;
  }

  async getCommentsCount({ postId }: FilterCommentDto): Promise<number> {
    return await this.commentModel.countDocuments({
      post: postId,
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
    if (!createCommentDto.parentId) {
      // root comment
      const newComment = await this.commentModel.create(createCommentDto);
      // 如果不是回复的话
      newComment.path.push(newComment._id);
      return newComment.save();
    }
    // not root comment
    const parentComment = await this.commentModel.findById(
      createCommentDto.parentId,
    );
    if (!parentComment) {
      throw new NotFoundException(
        `Not found ${createCommentDto.parentId} comment.`,
      );
    }
    const newComment = await this.commentModel.create(createCommentDto);
    // 如果是回复
    parentComment.path.push(newComment._id);
    newComment.path = [...parentComment.path];
    return newComment.save();
  }
}

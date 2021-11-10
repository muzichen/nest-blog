import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Comment } from './comment.schema';
import { CommentsService } from './comments.service';
import CreateCommentDto from './create-comment.dto';
import FilterCommentDto from './filter-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async getComments(@Query() query: FilterCommentDto): Promise<Comment[]> {
    const comments = this.commentsService.getComments({
      ...query,
    });
    return comments;
  }

  // @Get(':postId')
  // async getCommentsByPostId(
  //   @Param('postId') postId: string,
  // ): Promise<Comment[]> {
  //   return this.commentsService.getCommentsByPostId(postId);
  // }

  @Post('new')
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = await this.commentsService.create(createCommentDto);
    return comment;
  }
}

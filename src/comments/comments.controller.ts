import { Body, Controller, Post } from '@nestjs/common';
import { Comment } from './comment.schema';
import { CommentsService } from './comments.service';
import CreateCommentDto from './create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('new')
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = await this.commentsService.create(createCommentDto);
    return comment;
  }
}

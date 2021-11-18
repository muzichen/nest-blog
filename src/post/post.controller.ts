import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import RolesGuard from 'src/auth/roles.guard';
import CreatePostDto from './create-post.dto';
import GetPostsDto from './get-posts.dto';
import PostLikeDto from './post-like.dto';
import { Post as PostSchema, PostDocument } from './post.schema';
import { PostService } from './post.service';
// import { PostWithComments } from './types';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(200)
  @Get()
  async getPosts(
    @Query() { pageSize, currentPage, tag }: GetPostsDto,
  ): Promise<PaginateResult<PostDocument> | void> {
    const posts = await this.postService.getPosts({
      pageSize,
      currentPage,
      tag,
    });
    return posts;
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostSchema> {
    return this.postService.getPostById(id);
  }

  @Post('new')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostSchema> {
    return this.postService.createPost(createPostDto, req.user);
  }

  @Post('like')
  // @UseGuards(JwtAuthGuard) like 不用登录
  async like(@Body() { post_id }: PostLikeDto): Promise<boolean> {
    try {
      this.postService.postLike({
        post_id,
      });
      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}

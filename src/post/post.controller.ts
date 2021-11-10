import {
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import RolesGuard from 'src/auth/roles.guard';
import CreatePostDto from './create-post.dto';
import GetPostsDto from './get-posts.dto';
import { Post as PostSchema } from './post.schema';
import { PostService } from './post.service';
import { PostWithComments } from './types';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(200)
  @Get()
  async getAllPosts(
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('currentPage', ParseIntPipe) currentPage: number,
  ): Promise<PostWithComments[]> {
    const posts = await this.postService.getAllPosts({
      pageSize,
      currentPage,
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
}

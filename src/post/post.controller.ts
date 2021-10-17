import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import RolesGuard from 'src/auth/roles.guard';
import CreatePostDto from './create-post.dto';
import { Post as PostSchema } from './post.schema';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPosts(): Promise<PostSchema[]> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  async getPost(@Param() param): Promise<PostSchema> {
    return this.postService.getPostById(param.id);
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

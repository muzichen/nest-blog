import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'src/comments/comments.module';
import { PostController } from './post.controller';
import { PostSchema, Post } from './post.schema';
import { PostService } from './post.service';

@Module({
  imports: [
    CommentsModule,
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

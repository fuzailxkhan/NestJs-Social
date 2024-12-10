import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModule } from '../user/user.module'; // Import UserModule as forwardRef
import {Comment} from '../comment/comment.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post,Comment]),
    forwardRef(() => UserModule), // Avoid circular dependency
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}

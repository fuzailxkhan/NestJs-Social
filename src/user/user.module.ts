import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PostModule } from '../post/post.module'; // Import PostModule as forwardRef

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => PostModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService,
    TypeOrmModule, // Export TypeOrmModule to make UserRepository available
  ],
})
export class UserModule {}
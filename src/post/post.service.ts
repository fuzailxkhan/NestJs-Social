import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { Comment } from 'src/comment/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User) // Correctly inject the User repository
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment) // Correctly inject the User repository
    private readonly commentRepository: Repository<Comment>,

  ) {}

  create(postData: Partial<Post>, user: User): Promise<Post> {
    console.log(user)
    const post = this.postRepository.create({
      ...postData, 
      created_by: user,  
    });
    return this.postRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOne({ where: { id } });
  }

  async update(id: number, postData: Partial<Post>): Promise<Post> {
    await this.postRepository.update(id, postData);
    return this.findOne(id);
  }

  delete(id: number): Promise<void> {
    return this.postRepository.delete(id).then(() => undefined);
  }

  findAndCount(page: number, limit: number): Promise<[Post[], number]> {
    return this.postRepository.findAndCount({
      skip: (page - 1) * limit,  // Skip the posts based on the current page
      take: limit,  // Take the number of posts based on the limit
    });
  }

  async getNewsFeed(userId: number): Promise<Post[]> {
    // Fetch the user with their following relationships
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following', 'following.followed'], // Ensure the followed users are loaded
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Extract IDs of the followed users
    const followedUserIds = user.following.map((follow) => follow.followed.id);
  
    if (followedUserIds.length === 0) {
      return []; // Return an empty array if the user is not following anyone
    }
  
    // Fetch posts created by the followed users
    const posts = await this.postRepository.find({
      where: { created_by: In(followedUserIds) }, // Use TypeORM's `In` operator
      relations: ['created_by']
    })
  
    return posts;
  }

  async canComment(userId: number, postId: number): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['created_by'],
    });
  
    if (!post) throw new NotFoundException('Post not found');
  
    const following = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.following', 'follow')
      .where('user.id = :userId', { userId })
      .andWhere('follow.followedId = :followedId', { followedId: post.created_by.id })
      .getOne();
  
    return !!following;
  }

  async addComment(postId: number, userId: number, content: string): Promise<Comment> {
    const canComment = await this.canComment(userId, postId);
    if (!canComment) throw new ForbiddenException('You cannot comment on this post');
  
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
  
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
  
    const comment = this.commentRepository.create({
      content,
      post,
      created_by: user,
    });
  
    return this.commentRepository.save(comment);
  }

  async getComments(postId: number, userId: number): Promise<Comment[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['created_by'],
    });
  
    if (!post) throw new NotFoundException('Post not found');
  
    // Check if the user follows the post's creator
    const following = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.following', 'follow')
      .where('user.id = :userId', { userId })
      .andWhere('follow.followedId = :followedId', { followedId: post.created_by.id })
      .getOne();
  
    if (!following) {
      throw new ForbiddenException('You are not following the user who created this post');
    }
  
    // If the user follows the post's creator, fetch the comments
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['created_by'], // Optionally include creator information in the comment
    });
  }
}

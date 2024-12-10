// follow.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async follow(followerId: number, followedId: number): Promise<Follow> {
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
        const followed = await this.userRepository.findOne({ where: { id: followedId } });

    if (!follower || !followed) {
      throw new NotFoundException('User not found');
    }

    // Prevent a user from following themselves
    if (followerId === followedId) {
      throw new Error("You cannot follow yourself.");
    }

    // Check if the follow relationship already exists
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    if (existingFollow) {
      throw new Error('You are already following this user.');
    }

    const follow = this.followRepository.create({
      follower,
      followed,
    });

    return this.followRepository.save(follow);
  }

  async unfollow(followerId: number, followedId: number): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.delete(follow.id);
  }

  async getFollowing(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following', 'following.followed'], // Include the followed user relation
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
  
    const following = user.following.map((follow) => follow.followed);
  

  
    return following;
  }

  async getFollowers(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers' , 'followers.follower'],
    });


    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.followers.map((follow) => follow.follower);
  }
}

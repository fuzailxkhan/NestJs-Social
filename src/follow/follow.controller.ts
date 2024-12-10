import { Controller, Post, Delete, Param, Get, UseGuards, Request } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming you have JWT auth guard
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // Follow a user
  @Post(':followedId')
  @UseGuards(JwtAuthGuard)  // Ensure the user is authenticated
  @ApiOperation({ summary: 'Follow a user' })  // Describes the follow operation
  @ApiBearerAuth()  // Specifies that the endpoint requires authentication with a Bearer token
  @ApiResponse({
    status: 200,
    description: 'Successfully followed the user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or missing token',
  })
  async followUser(
    @Param('followedId') followedId: number,
    @Request() req,  // Get the logged-in user's ID from the request
  ) {
    const followerId = req.user.id;
    return this.followService.follow(followerId, followedId);
  }

  // Unfollow a user
  @Delete(':followedId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unfollow a user' })  // Describes the unfollow operation
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Successfully unfollowed the user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or missing token',
  })
  async unfollowUser(
    @Param('followedId') followedId: number,
    @Request() req,
  ) {
    const followerId = req.user.id;
    return this.followService.unfollow(followerId, followedId);
  }

  // Get list of users the current user is following
  @Get('following')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get users the current user is following' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved following users',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or missing token',
  })
  async getFollowing(@Request() req) {
    const userId = req.user.id;
    console.log("Following Endpoint User ID ", userId);
    return this.followService.getFollowing(userId);
  }

  // Get list of followers of the current user
  @Get('followers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get followers of the current user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved followers',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or missing token',
  })
  async getFollowers(@Request() req) {
    const userId = req.user.id;
    return this.followService.getFollowers(userId);
  }
}

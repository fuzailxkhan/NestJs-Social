import { Controller, Post, Get, Put, Delete, Param, Body, Request, UseGuards, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Comment } from 'src/comment/comment.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: PostEntity })  // Document the body of the POST request
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBearerAuth()  // Indicates that the endpoint requires authentication with a Bearer token
  create(@Body() postData: Partial<PostEntity>, @Request() req: any) {
    const user: User = req.user;
    console.log("User in Controller ", req.user);
    return this.postService.create(postData, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Retrieve all posts.', type: [PostEntity] })
  async findAll(
    @Query('page') page: number = 1,  // Default to page 1
    @Query('limit') limit: number = 10,  // Default to 10 posts per page
  ): Promise<{ posts: PostEntity[], total: number }> {
    const [posts, total] = await this.postService.findAndCount(page, limit);
    return { posts, total };  // Return both the posts and total count
  }

  @Get('newsFeed')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the user’s news feed' })
  @ApiResponse({ status: 200, description: 'Retrieve the news feed for the current user.', type: [PostEntity] })
  @ApiBearerAuth()
  async getNewsFeed(@Request() req: any): Promise<Partial<PostEntity[]>> {
    const userId = req.user.id; // Extract the user ID from the JWT payload
    return this.postService.getNewsFeed(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the post to retrieve' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the post.', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the post to update' })
  @ApiBody({ type: PostEntity })
  @ApiResponse({ status: 200, description: 'Successfully updated the post.', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() postData: Partial<PostEntity>) {
    return this.postService.update(id, postData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the post to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiBearerAuth()
  delete(@Param('id') id: number) {
    return this.postService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the post to add a comment to' })
  @ApiBody({ type: String, description: 'The content of the comment' })
  @ApiResponse({ status: 201, description: 'Successfully added the comment.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBearerAuth()
  async addComment(
    @Param('id') postId: number,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.postService.addComment(postId, userId, content);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the post to get comments for' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved comments.', type: [Comment] })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiBearerAuth()
  async getComments(
    @Param('id') postId: number,
    @Request() req: any
  ): Promise<Comment[]> {
    const userId = req.user.id; // Extract the user ID from the JWT payload
    return this.postService.getComments(postId, userId);
  }
}

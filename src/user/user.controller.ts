import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')  // Tag to group this controller in Swagger UI
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })  // Describes the operation in Swagger UI
  @ApiBody({
    description: 'The user registration data',
    type: User,  // You can also create a DTO for User registration and use that here
  })  
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: User,  // You can return a DTO as well for the response
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async register(@Body() createUserDto: Partial<User>) {
    return this.userService.createUser(createUserDto);
  }
}

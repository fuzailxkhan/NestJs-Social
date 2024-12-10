import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')  // Tagging for Swagger UI grouping
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })  // Describes the login operation in Swagger UI
  @ApiBody({
    description: 'Login credentials',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })  // Correct usage of schema in @ApiBody
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid credentials',
  })
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })  // Describes the profile operation
  @ApiBearerAuth()  // Indicates that the endpoint requires authentication with a Bearer token
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or missing token',
  })
  getProfile(@Request() req) {
    console.log('Request User:', req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')  // Specifies that only admin role can access this route
  @Get('admin')
  @ApiOperation({ summary: 'Get admin data' })  // Describes the admin data operation
  @ApiBearerAuth()  // Indicates that the endpoint requires authentication with a Bearer token
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved admin data',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, you do not have access to this route',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or missing token',
  })
  getAdminData() {
    return { message: 'This is a protected admin route' };
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    console.log("This is the Validate User object", user);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return { ...result, userId: user.id };
    }
    return null;
  }

  async login(user: any) {
    console.log("user Trying to login : " , user)
    
    const foundUser = await this.userService.findOneByUsername(user.username);
    if (!foundUser) {
      return {message:"User not found"};
    }
  
    
    const isPasswordMatch = await bcrypt.compare(user.password, foundUser.password);
    if (!isPasswordMatch) {
      return {message:"Invalid Password"};
    }
  
    
    const payload = { username: user.username, id: foundUser.id };
    console.log('Login Payload', payload);
  
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
}
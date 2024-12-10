import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ,
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
  
    
    const user = await this.userService.findOneById(payload.id);
    if (!user) {
      throw new Error('User not found');
    }
  
    return user;
  }
}
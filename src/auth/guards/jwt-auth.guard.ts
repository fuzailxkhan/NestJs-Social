import { ExecutionContext, Injectable} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log('Request Headers:', request.headers);
        return super.canActivate(context);
      }

    handleRequest(err, user, info) {
        if (err) {
          console.log('Error in JwtAuthGuard:', err);
        }
        if (!user) {
          console.log('User not found in JwtAuthGuard');
        }
        return user;
      }

}

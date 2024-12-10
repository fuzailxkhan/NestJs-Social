import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';  // Import the JWT Guard

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Call JwtAuthGuard to check if the user is authenticated
    const jwtAuthGuard = new JwtAuthGuard();
    const isJwtValid = jwtAuthGuard.canActivate(context);

    // Check if roles are specified in the route
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // If no roles are defined, allow access
    }

    // Get the user object from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If the user has the required role, grant access
    return requiredRoles.some(role => user.role?.includes(role));
  }
}

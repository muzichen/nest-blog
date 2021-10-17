import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export default class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (user.isAdmin) {
      return true;
    }
    return false;
  }
}

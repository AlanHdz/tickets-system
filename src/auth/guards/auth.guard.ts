import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { CookieService } from 'src/common/providers/cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly cookieService: CookieService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse()
    const token = request.cookies['token']
    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {

      const { user, token: newToken } = await this.authService.verifyToken(token)
      
      const userExists = await this.authService.findUser(user.id)

      if (!userExists) {
        res.clearCookie('token')
        throw new UnauthorizedException()
      }

      await this.cookieService.setCookie(res, 'token', token, 2, true);

      request['user'] = user;

    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
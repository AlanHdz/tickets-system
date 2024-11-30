import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, Inject, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenExistsInterceptor implements NestInterceptor {

  constructor(
    @Inject() private readonly authService: AuthService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest()
    const res: Response = context.switchToHttp().getResponse()

    const token = req.cookies['token'];

    if (token) {

      const { user, token: newToken } = await this.authService.verifyToken(token)

      const userExists = await this.authService.findUser(user.id)

      if (!userExists) {
        res.clearCookie('token')
        throw new UnauthorizedException()
      }
      
      throw new BadRequestException('You are login.')
    }
    
    return next
      .handle()
      .pipe();
  }
}
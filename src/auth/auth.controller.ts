import { Body, Controller, Get, HttpStatus, Post, Res, Response, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Response as ResponseExpress } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './interfaces';
import { User, Token } from './decorators'
import { AppService } from 'src/app.service';
import { TokenExistsInterceptor } from './interceptors/token-exists.interceptor';
import { CookieService } from 'src/common/providers/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
  ) {}

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Response() res: ResponseExpress) {
    const { token, user } = await this.authService.loginUser(loginUserDto)
    
    await this.cookieService.setCookie(res, 'token', token, 2, true);

    return res.status(HttpStatus.OK).json({ user })

  }

  @Post('register')
  @UseInterceptors(TokenExistsInterceptor)
  async registerUser(@Body() registerUserDto: RegisterUserDto, @Res() res: ResponseExpress) {

    const { user, token } = await this.authService.registerUser(registerUserDto)

    await this.cookieService.setCookie(res, 'token', token, 2, true);

    return res.status(HttpStatus.OK).json({ user })

  }

  @Get('verify')
  @UseGuards(AuthGuard)
  async hola(@User() user: CurrentUser, @Token() token: string) {
    return {
      user,
      token
    };
  }

}

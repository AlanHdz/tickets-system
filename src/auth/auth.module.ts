import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { CookieService } from 'src/common/providers/cookie.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CookieService],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '2h' }
    })
  ]
})
export class AuthModule {}
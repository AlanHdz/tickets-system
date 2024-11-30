import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { CookieService } from 'src/common/providers/cookie.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, AuthService, CookieService],
  imports: [AuthModule]
})
export class CommnetsModule {}

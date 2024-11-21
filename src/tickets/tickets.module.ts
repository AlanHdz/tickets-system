import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { CookieService } from 'src/common/providers/cookie.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, AuthService, CookieService],
})
export class TicketsModule {}

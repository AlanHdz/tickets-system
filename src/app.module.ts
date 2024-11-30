import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { CategoriesModule } from './categories/categories.module';
import { LabelsModule } from './labels/labels.module';
import { CommnetsModule } from './comments/comments.module';

@Module({
  imports: [UsersModule, AuthModule, TicketsModule, CategoriesModule, LabelsModule, CommnetsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

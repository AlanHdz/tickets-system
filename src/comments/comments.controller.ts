import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommnetDto } from './dto/update-commnet.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('tickets/:ticketId')
  @UseGuards(AuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @User() user: CurrentUser, @Param('ticketId') ticketId: string) {
    return this.commentsService.create(createCommentDto, user, +ticketId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}

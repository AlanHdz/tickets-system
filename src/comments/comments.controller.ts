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

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createCommentDto: CreateCommentDto, @User() user: CurrentUser) {
    return await this.commentsService.create(createCommentDto, user);
  }

  @Get('tickets/:ticketId')
  @UseGuards(AuthGuard)
  async getCommentsByTicket(@Param('ticketId') ticketId: string) {
    console.log(ticketId);
    
    return await this.commentsService.getCommentsByTicket(+ticketId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.commentsService.remove(+id);
  }
}

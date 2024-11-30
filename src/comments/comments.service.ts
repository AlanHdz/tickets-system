import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommnetDto } from './dto/update-commnet.dto';
import { CurrentUser } from 'src/auth/interfaces';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger()

  async onModuleInit() {
    await this.$connect()
  }


  create(createCommentDto: CreateCommentDto, user: CurrentUser, ticketId: number) {
    const { message } = createCommentDto

  }

  remove(id: number) {
    return `This action removes a #${id} commnet`;
  }
}

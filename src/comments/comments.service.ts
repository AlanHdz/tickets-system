import { HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/auth/interfaces';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger()

  async onModuleInit() {
    await this.$connect()
  }


  async create(createCommentDto: CreateCommentDto, user: CurrentUser) {

    try {
      const { message, ticketId } = createCommentDto

      const comment = await this.comment.create({
        data: {
          authorId: user.id,
          ticketId: ticketId,
          message: message
        }
      })

      return comment;
    } catch (error) {
      this.handleErrors(error)
    }

  }

  async getCommentsByTicket(ticketId: number) {

    try {
      
      const comments = await this.comment.findMany({ 
        where: { ticketId: ticketId },
        include: {
          author: {
            select: {
                name: true, lastName: true, username: true
            }
          }
        }
      })


      return comments;

    } catch (error) {
      this.handleErrors(error)
    }

  }

  async remove(id: number) {
    try {
      
      await this.comment.delete({ where: { id: id } })

      return {
        status: HttpStatus.OK,
        message: 'Comment deleted.'
      }

    } catch (error) {
      this.handleErrors(error)
    }
  }

  private handleErrors(error: any) {
    if (error.code === 'P2025') {
      throw new NotFoundException('Label not found')
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check logs')
  }
}

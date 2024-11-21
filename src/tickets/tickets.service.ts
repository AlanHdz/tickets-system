import { Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CurrentUser } from 'src/auth/interfaces';

@Injectable()
export class TicketsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger()

  async onModuleInit() {
    await this.$connect()
  }

  async create(createTicketDto: CreateTicketDto, user: CurrentUser) {

    try {
      const { title, description, priority, status, categoriesIds, labelsIds } = createTicketDto

      const categories = categoriesIds.map(categoryId => {
        return { category: { connect: { id: categoryId } } }
      })

      const labels = labelsIds.map(labelsId => {
        return { label: { connect: { id: labelsId } } }
      })

      const ticket = await this.ticket.create({
        data: {
          title: title,
          description: description,
          priority: priority,
          status: status,
          assignedId: user.id,
          categories: {
            create: categories
          },
          labels: {
            create: labels
          }
        },
        include: {
          categories: {
            select: {
              category: { select: { name: true, id: true } }
            }
          },
          labels: {
            select: {
              label: { select: { name: true, id: true } }
            }
          }
        }
      })

      return ticket

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  private handleExceptions(error: any) {

    if (error.code === 'P2025') {
      throw new NotFoundException(error.meta.cause)
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check logs')

  }

}

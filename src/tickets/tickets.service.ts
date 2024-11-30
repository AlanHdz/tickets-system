import { Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CurrentUser } from 'src/auth/interfaces';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { pagination } from 'src/common/utils/pagination.utils';
import { ChangeStatusTicketDto } from './dto/change-status-ticket.dto';
import { ChangePriorityTicketDto } from './dto/change-priority-ticket-dto';

@Injectable()
export class TicketsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger()

  async onModuleInit() {
    await this.$connect()
  }

  async create(createTicketDto: CreateTicketDto, user: CurrentUser) {

    try {
      const { title, description, priority, status, categoriesIds, labelsIds, assignedId } = createTicketDto

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
          assignedId: assignedId,
          createdBy: user.id,
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

  async findAll(paginationDto: PaginationDto) {
    try {
      
      const tickets = pagination(this.ticket, paginationDto, {
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

      return tickets;

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(id: number) {
    try {
      
      const ticket = await this.ticket.findUnique({
        where: { id: id },
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

      return ticket;

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async update(updateTicketDto: UpdateTicketDto, id: number) {

    try {
      const { title, description, assignedId, categoriesIds, labelsIds, priority, status } = updateTicketDto;

    const categories = categoriesIds.map(categoryId => {
      return { category: { connect: { id: categoryId } } }
    })

    const labels = labelsIds.map(labelsId => {
      return { label: { connect: { id: labelsId } } }
    })
    
    
    await this.categoriesOnTickets.deleteMany({
      where: {
        ticketId: id
      }
    })

    await this.labelsOnTickets.deleteMany({
      where: {
        ticketId: id
      }
    })

    const ticket = await this.ticket.update({
      where: { id: id },
      data: {
        title: title,
        description: description,
        assignedId: assignedId,
        priority: priority,
        status: status,
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

    return ticket;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async changePriority(id: number, changePriorityTicketDto: ChangePriorityTicketDto) {

    try {
      
      const { priority } = changePriorityTicketDto

      const ticket = await this.ticket.update({
        where: { id: id },
        data: {
          priority: priority
        }
      })

      return ticket;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async changeStatus(id: number, changeStatusTicketDto: ChangeStatusTicketDto) {

    try {
      
      const { status } = changeStatusTicketDto

      const ticket = await this.ticket.update({
        where: { id: id },
        data: {
          status: status
        }
      })

      return ticket;

    } catch (error) {
      this.handleExceptions(error)
    }
  }


  private handleExceptions(error: any) {

    if (error.code === 'P2025') {
      throw new NotFoundException(error.meta.cause)
    }
    console.log(error);
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check logs')

  }

}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createTicketDto: CreateTicketDto, @User() user: CurrentUser) {
    return await this.ticketsService.create(createTicketDto, user);
  }

}

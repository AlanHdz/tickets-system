import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChangeStatusTicketDto } from './dto/change-status-ticket.dto';
import { ChangePriorityTicketDto } from './dto/change-priority-ticket-dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createTicketDto: CreateTicketDto, @User() user: CurrentUser) {
    return await this.ticketsService.create(createTicketDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ticketsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  async update( @Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return await this.ticketsService.update(updateTicketDto, +id)
  }

  @Put('update-status/:id')
  async changeStatus(@Param('id') id: string, @Body() changeStatusTicketDto: ChangeStatusTicketDto) {
    return await this.ticketsService.changeStatus(+id, changeStatusTicketDto)
  }

  @Put('update-priority/:id')
  async changePriority(@Param('id') id: string, @Body() changePriorityTicketDto: ChangePriorityTicketDto) {
    return await this.ticketsService.changePriority(+id, changePriorityTicketDto)
  }

}

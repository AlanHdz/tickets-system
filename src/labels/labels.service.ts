import { HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { PrismaClient } from '@prisma/client';
import { pagination } from 'src/common/utils/pagination.utils';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class LabelsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger()

  async onModuleInit() {
    await this.$connect()
  }


  async create(createLabelDto: CreateLabelDto) {

    try {
      
      const { name } = createLabelDto

      const label = this.label.create({
        data: {
          name: name
        }
      })

      return label

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async findAll(paginationDto: PaginationDto) {

    try {
      
      const labels = pagination(this.label, paginationDto)

      return labels;

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(id: number) {
    
    try {
      
      const label = await this.label.findUnique({
        where: {
          id: id
        }
      })

      return label;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    
    try {

      const { name } = updateLabelDto;

      const labelUpdated = await this.label.update({
        where: {
          id: id
        },
        data: {
          name: name
        }
      })

      return labelUpdated;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: number) {
    
    try {

      await this.label.delete({ where: { id: id } })

      return {
        status: HttpStatus.OK,
        message: 'Category deleted.'
      }

    } catch (error) {
      this.handleExceptions(error)
    }
  }


  private handleExceptions(error: any) {

    if (error.code === 'P2025') {
      throw new NotFoundException('Label not found')
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check logs')

  }

}

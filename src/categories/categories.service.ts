import { HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { pagination } from 'src/common/utils/pagination.utils';

@Injectable()
export class CategoriesService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger();

  async onModuleInit() {
    await this.$connect()
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name } = createCategoryDto;

      const category = await this.category.create({
        data: {
          name: name
        }
      })

      return {
        category
      }

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    try {

      const categories = await pagination(this.category, paginationDto)
      return categories;

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findOne(id: number) {

    try {
      const category = await this.category.findUnique({ where: { id: id } })

      return category

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { name } = updateCategoryDto

      const updatedCategory = await this.category.update({
        where: { id: id },
        data: {
          name: name
        }
      })

      return updatedCategory
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: number) {

    try {
      await this.category.delete({ where: { id: id } })

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

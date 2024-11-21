import { skip } from "node:test";
import { PaginationDto } from "../dto/pagination.dto";
import { take } from "rxjs";



export const pagination = async (model: any, paginationDto: PaginationDto, args: any = { where: undefined }) => {
  const { limit, page } = paginationDto;

  const totalItems = await model.count({ where: args.where })
  
  const lastPage = Math.ceil(totalItems / limit);

  const data = await model.findMany({
    skip: (page - 1) * limit,
    take: limit,
    ...args
  })

  return {
    data,
    meta: {
      page: page,
      totalItems: totalItems,
      lastPage: lastPage
    }
  }

}
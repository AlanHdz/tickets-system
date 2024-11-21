import { Priority, Status } from "@prisma/client";
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { TicketPriorityList, TicketStatusList } from "../enum";
import { Type } from "class-transformer";


export class CreateTicketDto {

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TicketPriorityList, {
    message: `Valid priority are ${TicketPriorityList}`
  })
  priority: Priority

  @IsEnum(TicketStatusList, {
    message: `Valid status are ${TicketPriorityList}`
  })
  status: Status

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  categoriesIds: number[];

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  labelsIds: number[];

}
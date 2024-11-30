import { IsEnum, IsString } from "class-validator";
import { TicketPriorityList } from "../enum";
import { Priority } from "@prisma/client";


export class ChangePriorityTicketDto {


  @IsEnum(TicketPriorityList, {
    message: `Valid priority are ${TicketPriorityList}`
  })
  priority: Priority;

}
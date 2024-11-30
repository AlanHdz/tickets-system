import { IsEnum, IsString } from "class-validator";
import { TicketStatusList } from "../enum";
import { Status } from "@prisma/client";


export class ChangeStatusTicketDto {

  @IsEnum(TicketStatusList, {
    message: `Valid priority are ${TicketStatusList}`
  })
  status: Status;

}
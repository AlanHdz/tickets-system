import { IsNumber, IsPositive, IsString, Length, Min } from "class-validator";

export class CreateCommentDto {

  @IsString()
  message: string;

  @IsNumber()
  @IsPositive()
  ticketId: number;

}

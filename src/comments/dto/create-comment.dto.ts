import { IsString, Min } from "class-validator";

export class CreateCommentDto {

  @IsString()
  @Min(1)
  message: string;

}

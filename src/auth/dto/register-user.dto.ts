import { IsAlphanumeric, IsEmail, IsString, IsStrongPassword } from "class-validator";


export class RegisterUserDto {

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsAlphanumeric()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

}
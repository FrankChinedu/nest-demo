import { IsString, IsEmail, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @MinLength(1)
  first_name: string;

  @IsString()
  @MinLength(1)
  last_name: string;

  @IsEmail()
  email: string;
}

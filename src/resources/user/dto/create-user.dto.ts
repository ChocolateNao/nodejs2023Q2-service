import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
}

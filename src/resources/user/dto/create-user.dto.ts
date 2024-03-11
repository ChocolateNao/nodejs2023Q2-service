import {
  IsAlphanumeric,
  IsDefined,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  login: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
}

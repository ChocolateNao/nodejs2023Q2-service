import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

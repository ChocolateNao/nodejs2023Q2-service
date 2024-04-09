import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  year: number;

  @IsDefined()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;
}

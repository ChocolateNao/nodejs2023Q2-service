import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;

  @IsDefined()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  albumId: string | null;

  @IsDefined()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  duration: number;
}

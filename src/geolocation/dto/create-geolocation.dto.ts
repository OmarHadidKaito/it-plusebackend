import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateGeolocationDto {
  @IsString()
  address: string;

  @IsEmail()
  @IsOptional()
  email: string;
}

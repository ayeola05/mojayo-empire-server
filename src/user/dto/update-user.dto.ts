import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email: string;
}

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OrderIsPaidDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly update_time: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email_address: string;
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Mongoose } from 'mongoose';

export class UpdateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly user: string;
}

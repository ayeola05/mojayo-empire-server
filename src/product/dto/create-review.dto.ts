import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;
}

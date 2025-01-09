import { IsJSON, IsNumber, IsString } from 'class-validator';

export class CreateDetailEvaluationDto {
  @IsNumber()
  rating: number;

  @IsJSON()
  notes: string;

  @IsString()
  comment: string;
}

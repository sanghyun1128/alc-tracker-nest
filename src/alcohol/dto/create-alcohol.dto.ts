import { IsOptional } from 'class-validator';

export class CreateAlcoholDto {
  @IsOptional()
  images: {
    path: string;
    order: number;
    isNew: boolean;
  }[] = [];
}

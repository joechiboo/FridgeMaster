import { IsString, IsNumber, IsDateString, IsOptional, MinLength, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsDateString()
  boughtAt: string;

  @IsDateString()
  expireAt: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

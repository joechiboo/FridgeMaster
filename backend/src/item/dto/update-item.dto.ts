import { IsString, IsNumber, IsDateString, IsOptional, MinLength, Min } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsDateString()
  @IsOptional()
  boughtAt?: string;

  @IsDateString()
  @IsOptional()
  expireAt?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

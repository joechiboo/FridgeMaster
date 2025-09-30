import { IsString, MinLength } from 'class-validator';

export class CreateFridgeDto {
  @IsString()
  @MinLength(1)
  name: string;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CommonDto {
  @IsNumber()
  statusCode: number;

  @IsString()
  message: string;

  @IsOptional()
  error?: unknown;
}

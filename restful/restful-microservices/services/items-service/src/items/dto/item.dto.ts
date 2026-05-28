import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  tagIds?: string[];
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  tagIds?: string[];
}

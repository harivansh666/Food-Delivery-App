import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  rating?: '1' | '2' | '3' | '4' | '5';

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  cuisineType?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}

export default UpdateRestaurantDto;

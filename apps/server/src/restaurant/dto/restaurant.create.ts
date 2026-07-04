import { IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  ownerId!: string;
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  address!: string;

  @IsString()
  cuisineType!: string;

  @IsString()
  phone!: string;

  @IsString()
  email!: string;

  @IsString()
  @IsOptional()
  rating?: '1' | '2' | '3' | '4' | '5';

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

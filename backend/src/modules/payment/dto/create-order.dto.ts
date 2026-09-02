import { IsEnum, IsInt, IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsEnum(['PRODUCT', 'SERVICE', 'APPOINTMENT'])
  type: 'PRODUCT' | 'SERVICE' | 'APPOINTMENT';

  @IsOptional()
  @IsInt()
  itemId?: number;

  @IsOptional()
  @IsString()
  itemSlug?: string;

  @IsEnum(['STRIPE', 'RAZORPAY'])
  gateway: 'STRIPE' | 'RAZORPAY';

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  successUrl?: string;

  @IsOptional()
  @IsString()
  cancelUrl?: string;
}

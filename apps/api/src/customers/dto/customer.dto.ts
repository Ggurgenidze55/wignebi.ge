import { SubscriptionPlan } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullName?: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullName?: string;
}

export class GrantSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan!: SubscriptionPlan;

  @IsOptional()
  @IsInt()
  @Min(1)
  days?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  amountGel?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  paymentRef?: string;
}

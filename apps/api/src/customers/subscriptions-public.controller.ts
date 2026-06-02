import { Controller, Get, Query } from '@nestjs/common';
import { IsEmail } from 'class-validator';
import { CustomersService } from './customers.service';

class SubscriptionStatusQuery {
  @IsEmail()
  email!: string;
}

@Controller('subscriptions')
export class SubscriptionsPublicController {
  constructor(private customers: CustomersService) {}

  @Get('status')
  status(@Query() query: SubscriptionStatusQuery) {
    return this.customers.entitlementByEmail(query.email);
  }
}

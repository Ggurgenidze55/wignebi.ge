import { Module } from '@nestjs/common';
import { CustomersAdminController } from './customers-admin.controller';
import { CustomersService } from './customers.service';
import { SubscriptionsPublicController } from './subscriptions-public.controller';

@Module({
  controllers: [CustomersAdminController, SubscriptionsPublicController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}

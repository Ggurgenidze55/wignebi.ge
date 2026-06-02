import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role, SubscriptionPlan } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth-admin/jwt-auth.guard';
import { Roles } from '../auth-admin/roles.decorator';
import { RolesGuard } from '../auth-admin/roles.guard';
import { CustomersService } from './customers.service';
import {
  CreateCustomerDto,
  GrantSubscriptionDto,
  UpdateCustomerDto,
} from './dto/customer.dto';

type AuthReq = Request & { user: { id: string; email: string; role: Role } };

@Controller('admin/customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class CustomersAdminController {
  constructor(private customers: CustomersService) {}

  @Get()
  list() {
    return this.customers.list();
  }

  @Post()
  create(@Body() dto: CreateCustomerDto, @Req() req: AuthReq) {
    return this.customers.create(dto, req.user, req.ip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto, @Req() req: AuthReq) {
    return this.customers.update(id, dto, req.user, req.ip);
  }

  @Post(':id/subscribe')
  subscribe(@Param('id') id: string, @Body() dto: GrantSubscriptionDto, @Req() req: AuthReq) {
    return this.customers.grantSubscription(id, dto, req.user, req.ip);
  }

  @Post(':id/subscribe-30')
  subscribe30(@Param('id') id: string, @Req() req: AuthReq) {
    return this.customers.grantSubscription(
      id,
      { plan: SubscriptionPlan.STANDARD, days: 30 },
      req.user,
      req.ip,
    );
  }

  @Post(':id/cancel-subscription')
  cancelSubscription(@Param('id') id: string, @Req() req: AuthReq) {
    return this.customers.cancelActiveSubscription(id, req.user, req.ip);
  }
}

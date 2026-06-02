import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AuditAction,
  Role,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateCustomerDto,
  GrantSubscriptionDto,
  UpdateCustomerDto,
} from './dto/customer.dto';

type Actor = { id: string; email: string; role: Role };

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async syncExpiredSubscriptions() {
    const now = new Date();
    const expired = await this.prisma.subscription.findMany({
      where: { status: SubscriptionStatus.ACTIVE, endsAt: { lt: now } },
      select: { id: true, customerId: true },
      take: 200,
    });
    if (!expired.length) return 0;

    await this.prisma.subscription.updateMany({
      where: { id: { in: expired.map((s) => s.id) } },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    const customerIds = [...new Set(expired.map((s) => s.customerId))];
    for (const customerId of customerIds) {
      const active = await this.prisma.subscription.findFirst({
        where: { customerId, status: SubscriptionStatus.ACTIVE, endsAt: { gt: now } },
        orderBy: { endsAt: 'desc' },
      });

      await this.prisma.customer.update({
        where: { id: customerId },
        data: {
          currentPlan: active?.plan ?? SubscriptionPlan.FREE,
          subscriptionEnds: active?.endsAt ?? null,
        },
      });

      if (!active) {
        await this.audit.log({
          action: AuditAction.SUBSCRIPTION_EXPIRED,
          entityType: 'customer',
          entityId: customerId,
        });
      }
    }

    return expired.length;
  }

  async list() {
    await this.syncExpiredSubscriptions();

    const rows = await this.prisma.customer.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: {
        subscriptions: {
          orderBy: { endsAt: 'desc' },
          take: 1,
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      fullName: row.fullName,
      currentPlan: row.currentPlan,
      subscriptionEnds: row.subscriptionEnds,
      latestSubscription: row.subscriptions[0] ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  async create(dto: CreateCustomerDto, actor: Actor, ip?: string) {
    const row = await this.prisma.customer.create({
      data: {
        email: dto.email.toLowerCase(),
        fullName: dto.fullName,
      },
    });

    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.CUSTOMER_CREATED,
      entityType: 'customer',
      entityId: row.id,
      entityLabel: row.email,
      ipAddress: ip,
    });

    return row;
  }

  async update(id: string, dto: UpdateCustomerDto, actor: Actor, ip?: string) {
    const row = await this.prisma.customer.update({
      where: { id },
      data: { fullName: dto.fullName },
    });

    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.CUSTOMER_UPDATED,
      entityType: 'customer',
      entityId: row.id,
      entityLabel: row.email,
      ipAddress: ip,
    });

    return row;
  }

  async grantSubscription(id: string, dto: GrantSubscriptionDto, actor: Actor, ip?: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer || customer.deletedAt) throw new NotFoundException('Customer not found');

    await this.syncExpiredSubscriptions();

    const now = new Date();
    const active = await this.prisma.subscription.findFirst({
      where: {
        customerId: id,
        status: SubscriptionStatus.ACTIVE,
        endsAt: { gt: now },
      },
      orderBy: { endsAt: 'desc' },
    });

    const startsAt = active?.endsAt && active.endsAt > now ? active.endsAt : now;
    const days = dto.days ?? 30;
    const endsAt = new Date(startsAt.getTime() + days * 24 * 60 * 60 * 1000);

    if (active) {
      await this.prisma.subscription.update({
        where: { id: active.id },
        data: { status: SubscriptionStatus.CANCELLED },
      });
    }

    const row = await this.prisma.subscription.create({
      data: {
        customerId: id,
        plan: dto.plan,
        startsAt: now,
        endsAt,
        amountGel: dto.amountGel,
        paymentRef: dto.paymentRef,
        createdById: actor.id,
      },
    });

    await this.prisma.customer.update({
      where: { id },
      data: {
        currentPlan: dto.plan,
        subscriptionEnds: endsAt,
      },
    });

    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: active ? AuditAction.SUBSCRIPTION_RENEWED : AuditAction.SUBSCRIPTION_CREATED,
      entityType: 'customer',
      entityId: id,
      entityLabel: customer.email,
      metadata: {
        plan: dto.plan,
        days,
        endsAt: endsAt.toISOString(),
      },
      ipAddress: ip,
    });

    return row;
  }

  async cancelActiveSubscription(id: string, actor: Actor, ip?: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer || customer.deletedAt) throw new NotFoundException('Customer not found');

    const active = await this.prisma.subscription.findFirst({
      where: {
        customerId: id,
        status: SubscriptionStatus.ACTIVE,
        endsAt: { gt: new Date() },
      },
      orderBy: { endsAt: 'desc' },
    });

    if (!active) {
      await this.prisma.customer.update({
        where: { id },
        data: { currentPlan: SubscriptionPlan.FREE, subscriptionEnds: null },
      });
      return { ok: true, hadActive: false };
    }

    await this.prisma.subscription.update({
      where: { id: active.id },
      data: { status: SubscriptionStatus.CANCELLED, endsAt: new Date() },
    });

    await this.prisma.customer.update({
      where: { id },
      data: { currentPlan: SubscriptionPlan.FREE, subscriptionEnds: null },
    });

    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.SUBSCRIPTION_CANCELLED,
      entityType: 'customer',
      entityId: id,
      entityLabel: customer.email,
      ipAddress: ip,
    });

    return { ok: true, hadActive: true };
  }

  async entitlementByEmail(email: string) {
    await this.syncExpiredSubscriptions();

    const customer = await this.prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!customer || customer.deletedAt) {
      return {
        hasAccess: false,
        plan: SubscriptionPlan.FREE,
        subscriptionEnds: null,
      };
    }

    const now = new Date();
    const active =
      customer.currentPlan !== SubscriptionPlan.FREE &&
      !!customer.subscriptionEnds &&
      customer.subscriptionEnds > now;

    return {
      hasAccess: active,
      plan: active ? customer.currentPlan : SubscriptionPlan.FREE,
      subscriptionEnds: active ? customer.subscriptionEnds : null,
      customerId: customer.id,
    };
  }
}

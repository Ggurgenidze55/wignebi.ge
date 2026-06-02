import { Injectable } from '@nestjs/common';
import { SubscriptionPlan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async getStats() {
    const [totalBooks, publishedBooks, totalAuthors, totalGenres, totalCustomers, activeSubscribers, recentActivity] =
      await Promise.all([
        this.prisma.book.count({ where: { deletedAt: null } }),
        this.prisma.book.count({ where: { deletedAt: null, published: true } }),
        this.prisma.author.count({ where: { deletedAt: null } }),
        this.prisma.genre.count({ where: { deletedAt: null } }),
        this.prisma.customer.count({ where: { deletedAt: null } }),
        this.prisma.customer.count({
          where: {
            deletedAt: null,
            currentPlan: { not: SubscriptionPlan.FREE },
            subscriptionEnds: { gt: new Date() },
          },
        }),
        this.audit.findRecent(10),
      ]);

    return {
      totalBooks,
      publishedBooks,
      unpublishedBooks: totalBooks - publishedBooks,
      totalAuthors,
      totalGenres,
      totalCustomers,
      activeSubscribers,
      recentActivity,
    };
  }
}

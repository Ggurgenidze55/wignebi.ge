import { Injectable } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type AuditInput = {
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  entityLabel?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
};

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(input: AuditInput) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId,
        userEmail: input.userEmail,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        entityLabel: input.entityLabel,
        metadata: input.metadata as object | undefined,
        ipAddress: input.ipAddress,
      },
    });
  }

  async findRecent(limit = 50) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findAll(skip = 0, take = 100) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }
}

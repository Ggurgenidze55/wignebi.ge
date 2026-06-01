import { Injectable } from '@nestjs/common';
import { SlugEntityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlugService {
  constructor(private prisma: PrismaService) {}

  async recordRedirect(entityType: SlugEntityType, entityId: string, oldSlug: string, newSlug: string) {
    if (oldSlug === newSlug) return;
    await this.prisma.slugRedirect.upsert({
      where: { entityType_oldSlug: { entityType, oldSlug } },
      update: { newSlug, entityId },
      create: { entityType, oldSlug, newSlug, entityId },
    });
  }

  async resolve(entityType: SlugEntityType, slug: string) {
    return this.prisma.slugRedirect.findUnique({
      where: { entityType_oldSlug: { entityType, oldSlug: slug } },
    });
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction, Prisma, Role, SlugEntityType } from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { SlugService } from '../common/slug.service';
import { mapAuthor } from '../common/mappers';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthorDto } from './dto/author.dto';

type Actor = { id: string; email: string; role: Role };

@Injectable()
export class AuthorsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private slugs: SlugService,
  ) {}

  private notDeleted = { deletedAt: null };

  async findAll() {
    const rows = await this.prisma.author.findMany({
      where: this.notDeleted,
      orderBy: { name: 'asc' },
    });
    return rows.map(mapAuthor);
  }

  async findBySlug(slug: string) {
    const row = await this.prisma.author.findFirst({
      where: { slug, ...this.notDeleted },
    });
    if (!row) throw new NotFoundException();
    return mapAuthor(row);
  }

  async findAllAdmin(trash = false) {
    const rows = await this.prisma.author.findMany({
      where: trash ? { deletedAt: { not: null } } : this.notDeleted,
      orderBy: { name: 'asc' },
    });
    return rows.map(mapAuthor);
  }

  async create(dto: AuthorDto, actor: Actor, ip?: string) {
    const row = await this.prisma.author.create({ data: dto });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.AUTHOR_CREATED,
      entityType: 'author',
      entityId: row.id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return mapAuthor(row);
  }

  async update(id: string, dto: Partial<AuthorDto>, actor: Actor, ip?: string) {
    const existing = await this.prisma.author.findFirst({ where: { id, ...this.notDeleted } });
    if (!existing) throw new NotFoundException();
    if (dto.slug && dto.slug !== existing.slug) {
      await this.slugs.recordRedirect(SlugEntityType.AUTHOR, id, existing.slug, dto.slug);
    }
    const row = await this.prisma.author.update({ where: { id }, data: dto });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.AUTHOR_UPDATED,
      entityType: 'author',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return mapAuthor(row);
  }

  async softDelete(id: string, actor: Actor, ip?: string) {
    const row = await this.prisma.author.findFirst({ where: { id, ...this.notDeleted } });
    if (!row) throw new NotFoundException();
    await this.prisma.author.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.AUTHOR_DELETED,
      entityType: 'author',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async restore(id: string, actor: Actor, ip?: string) {
    const row = await this.prisma.author.findFirst({ where: { id, deletedAt: { not: null } } });
    if (!row) throw new NotFoundException();
    await this.prisma.author.update({ where: { id }, data: { deletedAt: null } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.AUTHOR_RESTORED,
      entityType: 'author',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async permanentDelete(id: string, actor: Actor, ip?: string) {
    if (actor.role !== Role.ADMIN) throw new ForbiddenException('Admin only');
    const row = await this.prisma.author.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    await this.prisma.author.delete({ where: { id } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.AUTHOR_PERMANENT_DELETE,
      entityType: 'author',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return { ok: true };
  }
}

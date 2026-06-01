import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction, Role, SlugEntityType } from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { SlugService } from '../common/slug.service';
import { mapGenre } from '../common/mappers';
import { PrismaService } from '../prisma/prisma.service';
import type { GenreDto } from './dto/genre.dto';

type Actor = { id: string; email: string; role: Role };

@Injectable()
export class GenresService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private slugs: SlugService,
  ) {}

  private notDeleted = { deletedAt: null };

  async findAll() {
    const rows = await this.prisma.genre.findMany({
      where: this.notDeleted,
      orderBy: { name: 'asc' },
    });
    return rows.map(mapGenre);
  }

  async findBySlug(slug: string) {
    const row = await this.prisma.genre.findFirst({
      where: { slug, ...this.notDeleted },
    });
    if (!row) throw new NotFoundException();
    return mapGenre(row);
  }

  async findAllAdmin(trash = false) {
    const rows = await this.prisma.genre.findMany({
      where: trash ? { deletedAt: { not: null } } : this.notDeleted,
      orderBy: { name: 'asc' },
    });
    return rows.map(mapGenre);
  }

  async create(dto: GenreDto, actor: Actor, ip?: string) {
    const row = await this.prisma.genre.create({ data: dto });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.GENRE_CREATED,
      entityType: 'genre',
      entityId: row.id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return mapGenre(row);
  }

  async update(id: string, dto: Partial<GenreDto>, actor: Actor, ip?: string) {
    const existing = await this.prisma.genre.findFirst({ where: { id, ...this.notDeleted } });
    if (!existing) throw new NotFoundException();
    if (dto.slug && dto.slug !== existing.slug) {
      await this.slugs.recordRedirect(SlugEntityType.GENRE, id, existing.slug, dto.slug);
    }
    const row = await this.prisma.genre.update({ where: { id }, data: dto });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.GENRE_UPDATED,
      entityType: 'genre',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return mapGenre(row);
  }

  async softDelete(id: string, actor: Actor, ip?: string) {
    const row = await this.prisma.genre.findFirst({ where: { id, ...this.notDeleted } });
    if (!row) throw new NotFoundException();
    await this.prisma.genre.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.GENRE_DELETED,
      entityType: 'genre',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async restore(id: string, actor: Actor, ip?: string) {
    const row = await this.prisma.genre.findFirst({ where: { id, deletedAt: { not: null } } });
    if (!row) throw new NotFoundException();
    await this.prisma.genre.update({ where: { id }, data: { deletedAt: null } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.GENRE_RESTORED,
      entityType: 'genre',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async permanentDelete(id: string, actor: Actor, ip?: string) {
    if (actor.role !== Role.ADMIN) throw new ForbiddenException('Admin only');
    const row = await this.prisma.genre.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    await this.prisma.genre.delete({ where: { id } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.GENRE_PERMANENT_DELETE,
      entityType: 'genre',
      entityId: id,
      entityLabel: row.name,
      ipAddress: ip,
    });
    return { ok: true };
  }
}

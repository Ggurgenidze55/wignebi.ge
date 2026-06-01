import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction, Prisma, Role, SlugEntityType } from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { SlugService } from '../common/slug.service';
import { bookInclude, clientAccessToDb, mapBook } from '../common/mappers';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateBookDto, UpdateBookDto } from './dto/book.dto';

type Actor = { id: string; email: string; role: Role };

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private slugs: SlugService,
  ) {}

  private notDeleted: Prisma.BookWhereInput = { deletedAt: null };

  async findPublished(filters?: {
    access?: string;
    genreSlug?: string;
    authorSlug?: string;
    isNew?: boolean;
    sort?: 'popular' | 'new';
    limit?: number;
  }) {
    const where: Prisma.BookWhereInput = { ...this.notDeleted, published: true };
    if (filters?.access) where.access = clientAccessToDb(filters.access as 'free' | 'subscription' | 'premium');
    if (filters?.isNew) where.isNew = true;
    if (filters?.authorSlug) where.author = { slug: filters.authorSlug, deletedAt: null };
    if (filters?.genreSlug) where.genres = { some: { genre: { slug: filters.genreSlug, deletedAt: null } } };

    const orderBy: Prisma.BookOrderByWithRelationInput[] =
      filters?.sort === 'new'
        ? [{ publishedAt: 'desc' }]
        : [{ popularity: 'desc' }, { publishedAt: 'desc' }];

    const rows = await this.prisma.book.findMany({
      where,
      include: bookInclude,
      orderBy,
      take: filters?.limit,
    });
    return rows.map(mapBook);
  }

  async findBySlug(slug: string) {
    const row = await this.prisma.book.findFirst({
      where: { slug, ...this.notDeleted, published: true },
      include: bookInclude,
    });
    if (!row) throw new NotFoundException('Book not found');
    return mapBook(row);
  }

  async findAllAdmin(trash = false) {
    const rows = await this.prisma.book.findMany({
      where: trash ? { deletedAt: { not: null } } : this.notDeleted,
      include: bookInclude,
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(mapBook);
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.book.findFirst({
      where: { id, ...this.notDeleted },
      include: bookInclude,
    });
    if (!row) throw new NotFoundException();
    return mapBook(row);
  }

  async create(dto: CreateBookDto, actor: Actor, ip?: string) {
    const author = await this.prisma.author.findFirst({
      where: { slug: dto.authorSlug, deletedAt: null },
    });
    if (!author) throw new NotFoundException('Author not found');
    const genres = await this.prisma.genre.findMany({
      where: { slug: { in: dto.genreSlugs }, deletedAt: null },
    });

    const row = await this.prisma.book.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        titleEn: dto.titleEn,
        description: dto.description,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        seoKeywords: dto.seoKeywords ?? [],
        narrator: dto.narrator,
        coverHue: dto.coverHue ?? 200,
        coverUrl: dto.coverUrl,
        rating: dto.rating,
        access: clientAccessToDb(dto.access),
        priceGel: dto.priceGel,
        durationSec: dto.durationSec ?? 0,
        tags: dto.tags ?? [],
        publishedAt: new Date(dto.publishedAt),
        popularity: dto.popularity ?? 0,
        isNew: dto.isNew ?? false,
        published: dto.published ?? true,
        authorId: author.id,
        genres: { create: genres.map((g) => ({ genreId: g.id })) },
        chapters: {
          create: (dto.chapters ?? []).map((ch, i) => ({
            title: ch.title,
            orderIndex: i,
            durationSec: ch.durationSec,
            audioUrl: ch.audioUrl,
            readingParagraphs: ch.readingParagraphs ?? [],
          })),
        },
      },
      include: bookInclude,
    });

    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.BOOK_CREATED,
      entityType: 'book',
      entityId: row.id,
      entityLabel: row.title,
      ipAddress: ip,
    });

    return mapBook(row);
  }

  async update(id: string, dto: UpdateBookDto, actor: Actor, ip?: string) {
    const existing = await this.prisma.book.findFirst({ where: { id, ...this.notDeleted } });
    if (!existing) throw new NotFoundException();

    if (dto.slug && dto.slug !== existing.slug) {
      await this.slugs.recordRedirect(SlugEntityType.BOOK, id, existing.slug, dto.slug);
    }

    let authorId = existing.authorId;
    if (dto.authorSlug) {
      const author = await this.prisma.author.findFirst({
        where: { slug: dto.authorSlug, deletedAt: null },
      });
      if (!author) throw new NotFoundException('Author not found');
      authorId = author.id;
    }

    if (dto.genreSlugs) {
      const genres = await this.prisma.genre.findMany({
        where: { slug: { in: dto.genreSlugs }, deletedAt: null },
      });
      await this.prisma.bookGenre.deleteMany({ where: { bookId: id } });
      await this.prisma.bookGenre.createMany({
        data: genres.map((g) => ({ bookId: id, genreId: g.id })),
      });
    }

    if (dto.chapters) {
      await this.prisma.chapter.deleteMany({ where: { bookId: id } });
      await this.prisma.chapter.createMany({
        data: dto.chapters.map((ch, i) => ({
          bookId: id,
          title: ch.title,
          orderIndex: i,
          durationSec: ch.durationSec,
          audioUrl: ch.audioUrl,
          readingParagraphs: ch.readingParagraphs ?? [],
        })),
      });
    }

    const row = await this.prisma.book.update({
      where: { id },
      data: {
        slug: dto.slug,
        title: dto.title,
        titleEn: dto.titleEn,
        description: dto.description,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        seoKeywords: dto.seoKeywords,
        narrator: dto.narrator,
        coverHue: dto.coverHue,
        coverUrl: dto.coverUrl,
        rating: dto.rating,
        access: dto.access ? clientAccessToDb(dto.access) : undefined,
        priceGel: dto.priceGel,
        durationSec: dto.durationSec,
        tags: dto.tags,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        popularity: dto.popularity,
        isNew: dto.isNew,
        published: dto.published,
        authorId,
      },
      include: bookInclude,
    });

    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.BOOK_UPDATED,
      entityType: 'book',
      entityId: id,
      entityLabel: row.title,
      ipAddress: ip,
    });

    return mapBook(row);
  }

  async softDelete(id: string, actor: Actor, ip?: string) {
    const row = await this.prisma.book.findFirst({ where: { id, ...this.notDeleted } });
    if (!row) throw new NotFoundException();
    await this.prisma.book.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.BOOK_DELETED,
      entityType: 'book',
      entityId: id,
      entityLabel: row.title,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async restore(id: string, actor: Actor, ip?: string) {
    const row = await this.prisma.book.findFirst({ where: { id, deletedAt: { not: null } } });
    if (!row) throw new NotFoundException();
    await this.prisma.book.update({ where: { id }, data: { deletedAt: null } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.BOOK_RESTORED,
      entityType: 'book',
      entityId: id,
      entityLabel: row.title,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async permanentDelete(id: string, actor: Actor, ip?: string) {
    if (actor.role !== Role.ADMIN) throw new ForbiddenException('Admin only');
    const row = await this.prisma.book.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    await this.prisma.book.delete({ where: { id } });
    await this.audit.log({
      userId: actor.id,
      userEmail: actor.email,
      action: AuditAction.BOOK_PERMANENT_DELETE,
      entityType: 'book',
      entityId: id,
      entityLabel: row.title,
      ipAddress: ip,
    });
    return { ok: true };
  }

  async getReadingParagraphs(bookSlug: string, chapterId: string) {
    const book = await this.prisma.book.findFirst({
      where: { slug: bookSlug, ...this.notDeleted },
    });
    if (!book) throw new NotFoundException();
    const chapter = await this.prisma.chapter.findFirst({
      where: { id: chapterId, bookId: book.id },
    });
    if (!chapter) throw new NotFoundException();
    return { paragraphs: chapter.readingParagraphs };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { bookInclude, clientAccessToDb, mapBook } from '../common/mappers';
import type { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findPublished(filters?: {
    access?: string;
    genreSlug?: string;
    authorSlug?: string;
    isNew?: boolean;
    sort?: 'popular' | 'new';
    limit?: number;
  }) {
    const where: Prisma.BookWhereInput = { published: true };
    if (filters?.access) where.access = clientAccessToDb(filters.access as 'free' | 'subscription' | 'premium');
    if (filters?.isNew) where.isNew = true;
    if (filters?.authorSlug) where.author = { slug: filters.authorSlug };
    if (filters?.genreSlug) where.genres = { some: { genre: { slug: filters.genreSlug } } };

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
      where: { slug, published: true },
      include: bookInclude,
    });
    if (!row) throw new NotFoundException('Book not found');
    return mapBook(row);
  }

  async findAllAdmin() {
    const rows = await this.prisma.book.findMany({
      include: bookInclude,
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(mapBook);
  }

  async findOneAdmin(id: string) {
    const row = await this.prisma.book.findUnique({ where: { id }, include: bookInclude });
    if (!row) throw new NotFoundException();
    return mapBook(row);
  }

  async create(dto: CreateBookDto) {
    const author = await this.prisma.author.findUnique({ where: { slug: dto.authorSlug } });
    if (!author) throw new NotFoundException('Author not found');
    const genres = await this.prisma.genre.findMany({ where: { slug: { in: dto.genreSlugs } } });

    const row = await this.prisma.book.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        titleEn: dto.titleEn,
        description: dto.description,
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
    return mapBook(row);
  }

  async update(id: string, dto: UpdateBookDto) {
    const existing = await this.prisma.book.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();

    let authorId = existing.authorId;
    if (dto.authorSlug) {
      const author = await this.prisma.author.findUnique({ where: { slug: dto.authorSlug } });
      if (!author) throw new NotFoundException('Author not found');
      authorId = author.id;
    }

    if (dto.genreSlugs) {
      const genres = await this.prisma.genre.findMany({ where: { slug: { in: dto.genreSlugs } } });
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
    return mapBook(row);
  }

  async remove(id: string) {
    await this.prisma.book.delete({ where: { id } });
    return { ok: true };
  }

  async getReadingParagraphs(bookSlug: string, chapterId: string) {
    const book = await this.prisma.book.findUnique({ where: { slug: bookSlug } });
    if (!book) throw new NotFoundException();
    const chapter = await this.prisma.chapter.findFirst({
      where: { id: chapterId, bookId: book.id },
    });
    if (!chapter) throw new NotFoundException();
    return { paragraphs: chapter.readingParagraphs };
  }
}

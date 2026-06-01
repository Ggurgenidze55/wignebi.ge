import { AccessTier as DbAccess } from '@prisma/client';

export type ClientAccessTier = 'free' | 'subscription' | 'premium';

export function dbAccessToClient(tier: DbAccess): ClientAccessTier {
  if (tier === DbAccess.SUBSCRIPTION) return 'subscription';
  if (tier === DbAccess.PREMIUM) return 'premium';
  return 'free';
}

export function clientAccessToDb(tier: ClientAccessTier): DbAccess {
  if (tier === 'subscription') return DbAccess.SUBSCRIPTION;
  if (tier === 'premium') return DbAccess.PREMIUM;
  return DbAccess.FREE;
}

const bookInclude = {
  author: true,
  genres: { include: { genre: true } },
  chapters: { orderBy: { orderIndex: 'asc' as const } },
};

export { bookInclude };

export function mapBook(row: {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  description: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  narrator: string;
  coverHue: number;
  coverUrl: string | null;
  rating: number | null;
  access: DbAccess;
  priceGel: number | null;
  durationSec: number;
  tags: string[];
  publishedAt: Date;
  popularity: number;
  isNew: boolean;
  author: { slug: string; name: string };
  genres: { genre: { slug: string } }[];
  chapters: {
    id: string;
    title: string;
    durationSec: number;
    audioUrl: string | null;
    orderIndex: number;
  }[];
}) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleEn: row.titleEn ?? undefined,
    author: row.author.name,
    authorSlug: row.author.slug,
    narrator: row.narrator,
    description: row.description,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    seoKeywords: row.seoKeywords ?? [],
    coverHue: row.coverHue,
    coverUrl: row.coverUrl ?? undefined,
    rating: row.rating ?? undefined,
    access: dbAccessToClient(row.access),
    priceGel: row.priceGel ?? undefined,
    durationSec: row.durationSec,
    genreSlugs: row.genres.map((g) => g.genre.slug),
    tags: row.tags,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
    popularity: row.popularity,
    isNew: row.isNew,
    chapters: row.chapters.map((c) => ({
      id: c.id,
      title: c.title,
      durationSec: c.durationSec,
      audioUrl: c.audioUrl ?? '',
    })),
  };
}

export function mapAuthor(row: {
  id: string;
  slug: string;
  name: string;
  bio: string;
  imageUrl: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  relatedSlugs: string[];
}) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    bio: row.bio,
    imageUrl: row.imageUrl ?? undefined,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    relatedSlugs: row.relatedSlugs,
  };
}

export function mapGenre(row: {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  relatedSlugs: string[];
}) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameEn: row.nameEn,
    description: row.description,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    relatedSlugs: row.relatedSlugs,
  };
}

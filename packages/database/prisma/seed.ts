import { PrismaClient, AccessTier, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authors } from '../../../data/authors';
import { genres } from '../../../data/genres';
import { books } from '../../../data/books';
import { getReadingParagraphs } from '../../../data/chapters';

const prisma = new PrismaClient();

function mapAccess(a: string): AccessTier {
  if (a === 'subscription') return AccessTier.SUBSCRIPTION;
  if (a === 'premium') return AccessTier.PREMIUM;
  return AccessTier.FREE;
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@tsignebi.ge';
  const adminPass = process.env.ADMIN_PASSWORD ?? 'TsignebiAdmin2026!';
  const hash = await bcrypt.hash(adminPass, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash, name: 'Admin', role: Role.ADMIN },
    create: { email: adminEmail, passwordHash: hash, name: 'Admin', role: Role.ADMIN },
  });

  for (const a of authors) {
    await prisma.author.upsert({
      where: { slug: a.slug },
      update: {
        name: a.name,
        bio: a.bio,
        imageUrl: a.imageUrl,
        relatedSlugs: a.relatedSlugs,
      },
      create: {
        slug: a.slug,
        name: a.name,
        bio: a.bio,
        imageUrl: a.imageUrl,
        relatedSlugs: a.relatedSlugs,
      },
    });
  }

  for (const g of genres) {
    await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {
        name: g.name,
        nameEn: g.nameEn,
        description: g.description,
        relatedSlugs: g.relatedSlugs,
      },
      create: {
        slug: g.slug,
        name: g.name,
        nameEn: g.nameEn,
        description: g.description,
        relatedSlugs: g.relatedSlugs,
      },
    });
  }

  for (const b of books) {
    const author = await prisma.author.findUnique({ where: { slug: b.authorSlug } });
    if (!author) {
      console.warn(`Skip book ${b.slug}: author ${b.authorSlug} missing`);
      continue;
    }

    const genreRecords = await prisma.genre.findMany({
      where: { slug: { in: b.genreSlugs } },
    });

    await prisma.book.upsert({
      where: { slug: b.slug },
      update: {
        title: b.title,
        titleEn: b.titleEn,
        description: b.description,
        narrator: b.narrator,
        coverHue: b.coverHue,
        coverUrl: b.coverUrl,
        rating: b.rating,
        access: mapAccess(b.access),
        priceGel: b.priceGel,
        durationSec: b.durationSec,
        tags: b.tags,
        publishedAt: new Date(b.publishedAt),
        popularity: b.popularity,
        isNew: b.isNew ?? false,
        authorId: author.id,
        genres: {
          deleteMany: {},
          create: genreRecords.map((g) => ({ genreId: g.id })),
        },
        chapters: {
          deleteMany: {},
          create: b.chapters.map((ch, i) => ({
            title: ch.title,
            orderIndex: i,
            durationSec: ch.durationSec,
            audioUrl: ch.audioUrl,
            readingParagraphs: getReadingParagraphs(b.slug, ch.id, ch.title),
          })),
        },
      },
      create: {
        slug: b.slug,
        title: b.title,
        titleEn: b.titleEn,
        description: b.description,
        narrator: b.narrator,
        coverHue: b.coverHue,
        coverUrl: b.coverUrl,
        rating: b.rating,
        access: mapAccess(b.access),
        priceGel: b.priceGel,
        durationSec: b.durationSec,
        tags: b.tags,
        publishedAt: new Date(b.publishedAt),
        popularity: b.popularity,
        isNew: b.isNew ?? false,
        authorId: author.id,
        genres: {
          create: genreRecords.map((g) => ({ genreId: g.id })),
        },
        chapters: {
          create: b.chapters.map((ch, i) => ({
            title: ch.title,
            orderIndex: i,
            durationSec: ch.durationSec,
            audioUrl: ch.audioUrl,
            readingParagraphs: getReadingParagraphs(b.slug, ch.id, ch.title),
          })),
        },
      },
    });
  }

  console.log(`Seeded admin (${adminEmail}), ${authors.length} authors, ${genres.length} genres, ${books.length} books`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

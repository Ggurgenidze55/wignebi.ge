import { getAllAuthors, getAllBooks, getAllGenres } from '@/lib/cms/catalog';
import { SITE_URL } from '@/lib/seo/site-url';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, authors, genres] = await Promise.all([
    getAllBooks(),
    getAllAuthors(),
    getAllGenres(),
  ]);

  const staticPages = [
    '',
    '/library',
    '/pricing',
    '/authors',
    '/genres',
    '/audiobooks',
    '/audiobooks/free',
    '/audiobooks/premium',
    '/books/new',
    '/books/popular',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const bookPages = books.flatMap((b) => [
    {
      url: `${SITE_URL}/book/${b.slug}`,
      lastModified: new Date(b.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/read/${b.slug}`,
      lastModified: new Date(b.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  const authorPages = authors.map((a) => ({
    url: `${SITE_URL}/authors/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const genrePages = genres.map((g) => ({
    url: `${SITE_URL}/genres/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...bookPages, ...authorPages, ...genrePages];
}

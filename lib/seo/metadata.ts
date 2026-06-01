import type { Metadata } from 'next';
import type { Author } from '@/types/catalog';
import type { Book } from '@/types/book';
import type { Genre } from '@/types/catalog';
import { site, bookCoverUrl } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo/site-url';

const defaultOg = absoluteUrl('/manifest.json');

export function bookMetadata(book: Book): Metadata {
  const title = `${book.title} | Audiobook & Ebook | ${site.name}`;
  const description = `Listen to and read ${book.title} by ${book.author} on ${site.name}. ქართულად ონლაინ.`;
  const url = absoluteUrl(`/book/${book.slug}`);
  const image = book.coverUrl ?? bookCoverUrl(book.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: 'ka_GE',
      type: 'book',
      images: [{ url: image, width: 480, height: 720, alt: book.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function authorMetadata(author: Author, bookCount: number): Metadata {
  const title = `${author.name} — ავტორი | ${site.name}`;
  const description = `${author.name}: ${bookCount} წიგნი Tsignebi.ge-ზე. ${author.bio.slice(0, 140)}…`;
  const url = absoluteUrl(`/authors/${author.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, locale: 'ka_GE', type: 'profile' },
    twitter: { card: 'summary', title, description },
  };
}

export function genreMetadata(genre: Genre, bookCount: number): Metadata {
  const title = `${genre.name} — წიგნები და აუდიოწიგნები | ${site.name}`;
  const description = `${genre.description} ${bookCount} წიგნი ჟანრში „${genre.name}“.`;
  const url = absoluteUrl(`/genres/${genre.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, locale: 'ka_GE' },
    twitter: { card: 'summary', title, description },
  };
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  h1?: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: `${opts.title} | ${site.name}`,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      locale: 'ka_GE',
    },
    twitter: { card: 'summary', title: opts.title, description: opts.description },
  };
}

export { defaultOg };

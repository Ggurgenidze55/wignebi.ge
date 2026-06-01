import type { Author, Genre } from '@/types/catalog';
import type { Book } from '@/types/book';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo/site-url';

type BreadcrumbItem = { name: string; href: string };

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/manifest.json'),
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${site.name}.ge`,
    url: absoluteUrl('/'),
    description: site.description,
    inLanguage: 'ka',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/library')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function bookSchema(book: Book, authorName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: { '@type': 'Person', name: authorName },
    description: book.description,
    inLanguage: 'ka',
    url: absoluteUrl(`/book/${book.slug}`),
    image: book.coverUrl,
    bookFormat: 'https://schema.org/AudiobookFormat',
    offers:
      book.access === 'premium' && book.priceGel
        ? {
            '@type': 'Offer',
            price: book.priceGel,
            priceCurrency: 'GEL',
            availability: 'https://schema.org/InStock',
          }
        : undefined,
  };
}

export function authorSchema(author: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    url: absoluteUrl(`/authors/${author.slug}`),
    image: author.imageUrl,
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function genreCollectionSchema(genre: Genre, bookCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: genre.name,
    description: genre.description,
    url: absoluteUrl(`/genres/${genre.slug}`),
    numberOfItems: bookCount,
  };
}

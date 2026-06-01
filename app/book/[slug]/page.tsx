import { BookPageClient } from '@/app/book/[slug]/BookPageClient';
import { getAllBookSlugs, getAuthorBySlug, getBookBySlug, getGenreBySlug, getSimilarBooks } from '@/lib/cms/catalog';
import { bookMetadata } from '@/lib/seo/metadata';
import { JsonLd, bookSchema, breadcrumbSchema } from '@/lib/seo/json-ld';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug);
  if (!book) return {};
  return bookMetadata(book);
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug);
  if (!book) notFound();

  const [similar, author] = await Promise.all([
    getSimilarBooks(book, 4),
    getAuthorBySlug(book.authorSlug),
  ]);
  const genreLabels = (
    await Promise.all(book.genreSlugs.map((s) => getGenreBySlug(s)))
  ).filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          bookSchema(book, book.author),
          breadcrumbSchema([
            { name: 'მთავარი', href: '/' },
            { name: 'ბიბლიოთეკა', href: '/library' },
            { name: book.title, href: `/book/${book.slug}` },
          ]),
        ]}
      />
      <BookPageClient book={book} similar={similar} author={author} genreLabels={genreLabels} />
    </>
  );
}

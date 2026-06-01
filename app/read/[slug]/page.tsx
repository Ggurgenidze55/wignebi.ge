import { BookReader } from '@/components/reader/BookReader';
import { JsonLd, bookSchema, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import { getAllBookSlugs, getAuthorBySlug, getBookBySlug, getGenreBySlug, getReadingParagraphs } from '@/lib/cms/catalog';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug);
  if (!book) return {};
  return pageMetadata({
    title: `წაკითხვა: ${book.title}`,
    description: `წაიკითხე „${book.title}“ ონლაინ — ${book.author}. ელწიგნი Tsignebi.ge-ზე.`,
    path: `/read/${book.slug}`,
  });
}

export default async function ReadPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { chapter?: string };
}) {
  const book = await getBookBySlug(params.slug);
  if (!book) notFound();

  const author = await getAuthorBySlug(book.authorSlug);
  const genre = await getGenreBySlug(book.genreSlugs[0] ?? '');
  const chapterId = searchParams.chapter ?? book.chapters[0]?.id;
  const chapter = book.chapters.find((c) => c.id === chapterId) ?? book.chapters[0];
  const initialParagraphs = chapter
    ? await getReadingParagraphs(book.slug, chapter.id, chapter.title)
    : [];

  return (
    <>
      <JsonLd
        data={[
          bookSchema(book, book.author),
          breadcrumbSchema([
            { name: 'მთავარი', href: '/' },
            { name: 'ბიბლიოთეკა', href: '/library' },
            { name: book.title, href: `/book/${book.slug}` },
            { name: 'კითხვა', href: `/read/${book.slug}` },
          ]),
        ]}
      />
      <BookReader
        book={book}
        authorName={author?.name ?? book.author}
        genreLabel={genre?.name}
        initialChapterId={searchParams.chapter}
        initialParagraphs={initialParagraphs}
      />
    </>
  );
}

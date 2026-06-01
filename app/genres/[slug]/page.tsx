import {
  getAllGenreSlugs,
  getBooksByGenre,
  getGenreBySlug,
} from '@/lib/cms/catalog';
import { CatalogPage } from '@/components/catalog/CatalogPage';
import { JsonLd, breadcrumbSchema, genreCollectionSchema } from '@/lib/seo/json-ld';
import { genreMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllGenreSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const genre = await getGenreBySlug(params.slug);
  if (!genre) return {};
  const genreBooks = await getBooksByGenre(genre.slug);
  return genreMetadata(genre, genreBooks.length);
}

export default async function GenrePage({ params }: { params: { slug: string } }) {
  const genre = await getGenreBySlug(params.slug);
  if (!genre) notFound();

  const genreBooks = await getBooksByGenre(genre.slug);
  const related = (
    await Promise.all(genre.relatedSlugs.map((s) => getGenreBySlug(s)))
  ).filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          genreCollectionSchema(genre, genreBooks.length),
          breadcrumbSchema([
            { name: 'მთავარი', href: '/' },
            { name: 'ჟანრები', href: '/genres' },
            { name: genre.name, href: `/genres/${genre.slug}` },
          ]),
        ]}
      />
      <CatalogPage
        title={genre.name}
        description={genre.description}
        books={genreBooks}
        breadcrumbs={[
          { name: 'მთავარი', href: '/' },
          { name: 'ჟანრები', href: '/genres' },
          { name: genre.name, href: `/genres/${genre.slug}` },
        ]}
      >
        {related.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-fg-muted">მსგავსი ჟანრები</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((g) =>
                g ? (
                  <Link
                    key={g.slug}
                    href={`/genres/${g.slug}`}
                    className="rounded-full border border-line px-3 py-1 text-sm no-underline hover:border-brand-indigo/30"
                  >
                    {g.name}
                  </Link>
                ) : null,
              )}
            </div>
          </div>
        ) : null}
      </CatalogPage>
    </>
  );
}

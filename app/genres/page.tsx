import { getAllBooks, getAllGenres } from '@/lib/cms/catalog';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';

export const metadata = pageMetadata({
  title: 'ჟანრები — წიგნები და აუდიოწიგნები',
  description: 'აირჩიე ჟანრი: ბიზნესი, ისტორია, მოთხრობა, კლასიკა და სხვა. ქართული აუდიოწიგნები Tsignebi.ge-ზე.',
  path: '/genres',
});

export default async function GenresIndexPage() {
  const [genres, allBooks] = await Promise.all([getAllGenres(), getAllBooks()]);
  const countByGenre = new Map<string, number>();
  for (const b of allBooks) {
    for (const g of b.genreSlugs) {
      countByGenre.set(g, (countByGenre.get(g) ?? 0) + 1);
    }
  }
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'მთავარი', href: '/' },
          { name: 'ჟანრები', href: '/genres' },
        ])}
      />
      <main className="mx-auto max-w-page px-6 py-12">
        <Breadcrumbs
          items={[
            { name: 'მთავარი', href: '/' },
            { name: 'ჟანრები', href: '/genres' },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight">ჟანრები</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          იპოვე შენი შემდეგი წიგნი ჟანრის მიხედვით — {genres.length} კატეგორია.
        </p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((genre) => {
            const count = countByGenre.get(genre.slug) ?? 0;
            return (
              <li key={genre.id}>
                <Link
                  href={`/genres/${genre.slug}`}
                  className="panel block p-6 no-underline transition-transform hover:-translate-y-0.5"
                >
                  <h2 className="text-lg font-semibold text-fg">{genre.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{genre.description}</p>
                  <p className="mt-4 text-xs font-medium text-brand-cyan">{count} წიგნი</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}

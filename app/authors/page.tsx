import { getAllAuthors, getAllBooks } from '@/lib/cms/catalog';
import { JsonLd, breadcrumbSchema } from '@/lib/seo/json-ld';
import { pageMetadata } from '@/lib/seo/metadata';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = pageMetadata({
  title: 'ავტორები — ქართული ლიტერატურა',
  description: 'აღმოაჩინე ავტორები Tsignebi.ge-ზე. ქართული აუდიოწიგნები და ელწიგნები თითოეული მწერლისთვის.',
  path: '/authors',
});

export default async function AuthorsIndexPage() {
  const [authors, books] = await Promise.all([getAllAuthors(), getAllBooks()]);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'მთავარი', href: '/' },
          { name: 'ავტორები', href: '/authors' },
        ])}
      />
      <main className="mx-auto max-w-page px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">ავტორები</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          {authors.length}+ ავტორი — კლასიკური და თანამედროვე ქართული ლიტერატურა ერთ პლატფორმაზე.
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => {
            const count = books.filter((b) => b.authorSlug === author.slug).length;
            return (
              <li key={author.id}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="panel flex gap-4 p-5 no-underline transition-transform hover:-translate-y-0.5"
                >
                  {author.imageUrl ? (
                    <Image
                      src={author.imageUrl}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div>
                    <h2 className="font-semibold text-fg">{author.name}</h2>
                    <p className="mt-1 text-sm text-fg-muted">{count} წიგნი</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}

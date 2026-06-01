import {
  getAllAuthorSlugs,
  getAuthorBySlug,
  getBooksByAuthor,
} from '@/lib/cms/catalog';
import { BookCoverCard } from '@/components/ui/BookCover';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, authorSchema, breadcrumbSchema } from '@/lib/seo/json-ld';
import { authorMetadata } from '@/lib/seo/metadata';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const author = await getAuthorBySlug(params.slug);
  if (!author) return {};
  const authorBooks = await getBooksByAuthor(author.slug);
  return authorMetadata(author, authorBooks.length);
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = await getAuthorBySlug(params.slug);
  if (!author) notFound();

  const authorBooks = await getBooksByAuthor(author.slug);
  const related = (
    await Promise.all(author.relatedSlugs.map((s) => getAuthorBySlug(s)))
  )
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          authorSchema(author),
          breadcrumbSchema([
            { name: 'მთავარი', href: '/' },
            { name: 'ავტორები', href: '/authors' },
            { name: author.name, href: `/authors/${author.slug}` },
          ]),
        ]}
      />
      <main className="mx-auto max-w-page px-6 py-12">
        <Breadcrumbs
          items={[
            { name: 'მთავარი', href: '/' },
            { name: 'ავტორები', href: '/authors' },
            { name: author.name, href: `/authors/${author.slug}` },
          ]}
        />
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          {author.imageUrl ? (
            <Image
              src={author.imageUrl}
              alt={author.name}
              width={160}
              height={160}
              className="h-40 w-40 rounded-2xl object-cover shadow-cover"
              priority
            />
          ) : null}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{author.name}</h1>
            <p className="mt-2 text-fg-muted">{authorBooks.length} წიგნი</p>
            <p className="mt-6 max-w-2xl leading-relaxed text-fg-muted">{author.bio}</p>
          </div>
        </div>

        <h2 className="mt-14 text-xl font-semibold">წიგნები</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {authorBooks.map((b) => (
            <BookCoverCard key={b.id} book={b} />
          ))}
        </div>

        {related.length > 0 ? (
          <>
            <h2 className="mt-14 text-xl font-semibold">მსგავსი ავტორები</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {related.map((a) =>
                a ? (
                  <li key={a.slug}>
                    <Link
                      href={`/authors/${a.slug}`}
                      className="rounded-full border border-line px-4 py-2 text-sm no-underline hover:border-brand-indigo/30 hover:text-brand-indigo"
                    >
                      {a.name}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </>
        ) : null}
      </main>
    </>
  );
}

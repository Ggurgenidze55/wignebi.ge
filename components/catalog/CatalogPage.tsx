import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FadeUp } from '@/components/ui/fade-up';
import { BookCoverCard } from '@/components/ui/BookCover';
import type { Book } from '@/types/book';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function CatalogPage({
  title,
  description,
  books,
  breadcrumbs,
  children,
}: {
  title: string;
  description: string;
  books: Book[];
  breadcrumbs: { name: string; href: string }[];
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-page px-6 py-12">
      <Breadcrumbs items={breadcrumbs} />
      <FadeUp>
        <h1 className="text-3xl font-semibold tracking-tight text-fg">{title}</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">{description}</p>
      </FadeUp>

      {children}

      <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book, i) => (
          <FadeUp key={book.id} delay={Math.min(i * 0.03, 0.3)}>
            <BookCoverCard book={book} />
          </FadeUp>
        ))}
      </div>

      {books.length === 0 ? (
        <p className="mt-12 text-center text-fg-muted">წიგნები ჯერ არ არის ამ კატეგორიაში.</p>
      ) : null}

      <div className="mt-16 border-t border-line pt-8 text-center">
        <Link href="/library" className="btn-secondary">
          სრული ბიბლიოთეკა
        </Link>
      </div>
    </main>
  );
}

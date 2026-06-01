'use client';

import type { Book } from '@/types/book';
import { BookRowCard } from '@/components/ui/BookCover';
import { FadeUp } from '@/components/ui/fade-up';
import { cn } from '@/lib/cn';
import { useSearchParams } from 'next/navigation';

const filters = [
  { id: 'all', label: 'ყველა' },
  { id: 'free', label: 'უფასო' },
  { id: 'subscription', label: 'საბსკრიფშენი' },
  { id: 'premium', label: 'პრემიუმ' },
] as const;

export function LibraryClient({ books }: { books: Book[] }) {
  const params = useSearchParams();
  const filter = (params.get('filter') as (typeof filters)[number]['id']) || 'all';
  const list = filter === 'all' ? books : books.filter((b) => b.access === filter);

  return (
    <main className="mx-auto max-w-page px-6 py-12">
      <FadeUp>
        <h1 className="text-3xl font-semibold tracking-tight">ბიბლიოთეკა</h1>
        <p className="mt-2 text-fg-muted">{list.length} წიგნი</p>
      </FadeUp>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <a
            key={f.id}
            href={f.id === 'all' ? '/library' : `/library?filter=${f.id}`}
            className={cn(
              'rounded-full border px-4 py-2 text-sm transition',
              filter === f.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-line text-fg-muted hover:border-accent/40',
            )}
          >
            {f.label}
          </a>
        ))}
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((book, i) => (
          <FadeUp key={book.id} delay={0.03 * (i % 12)}>
            <BookRowCard book={book} />
          </FadeUp>
        ))}
      </ul>
    </main>
  );
}

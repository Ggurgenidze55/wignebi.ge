'use client';

import type { Book } from '@/types/book';
import type { Author, Genre } from '@/types/catalog';
import { accessLabel, canListen, formatDuration, formatTime } from '@/lib/access';
import { usePlayerStore } from '@/lib/player-store';
import { CoverArt, BookCoverCard } from '@/components/ui/BookCover';
import { FadeUp } from '@/components/ui/fade-up';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { BookOpen, Play, Star } from 'lucide-react';

function tierClass(access: Book['access']) {
  if (access === 'free') return 'badge-free';
  if (access === 'subscription') return 'badge-sub';
  return 'badge-premium';
}

export function BookPageClient({
  book,
  similar,
  author,
  genreLabels,
}: {
  book: Book;
  similar: Book[];
  author?: Author;
  genreLabels: (Genre | undefined)[];
}) {
  const { loadBook, play, plan, purchasedIds, purchaseBook, getSavedProgress } = usePlayerStore();
  const allowed = canListen(book, plan, purchasedIds);
  const saved = getSavedProgress(book.id);
  const rating = book.rating ?? 4.7;

  return (
    <main>
      <section className="border-b border-line bg-gradient-to-b from-base-surface/80 to-transparent">
        <div className="mx-auto max-w-page px-6 pb-10 pt-8">
          <Link href="/library" className="link-muted text-sm">
            ← ბიბლიოთეკა
          </Link>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end">
            <CoverArt book={book} size="hero" tilt className="mx-auto sm:mx-0" />
            <div className="flex-1 pb-2">
              <span className={cn('text-xs font-medium uppercase tracking-wide', tierClass(book.access))}>
                {accessLabel(book)}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-5xl">{book.title}</h1>
              <p className="mt-2 text-lg text-fg-muted">
                {author ? (
                  <Link href={`/authors/${author.slug}`} className="text-fg-muted hover:text-brand-indigo">
                    {book.author}
                  </Link>
                ) : (
                  book.author
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.genreSlugs.map((g, i) => {
                  const genre = genreLabels[i];
                  if (!genre) return null;
                  return (
                    <Link
                      key={g}
                      href={`/genres/${genre.slug}`}
                      className="rounded-full border border-line/80 bg-white/70 px-3 py-0.5 text-xs text-fg-muted no-underline hover:border-brand-indigo/30 hover:text-brand-indigo"
                    >
                      {genre.name}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-fg-muted">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {rating}
                </span>
                <span>{formatDuration(book.durationSec)}</span>
                <span>მოთხრობი: {book.narrator}</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {allowed ? (
                  <button
                    type="button"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-indigo px-8 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                    onClick={() => {
                      loadBook(book);
                      play();
                    }}
                  >
                    <Play className="h-5 w-5" fill="currentColor" />
                    {saved ? 'გაგრძელება' : 'მოსმენა'}
                  </button>
                ) : null}
                <Link
                  href={`/read/${book.slug}`}
                  className="btn-secondary inline-flex h-12 items-center gap-2 !rounded-full"
                >
                  <BookOpen className="h-4 w-4" />
                  წაკითხვა
                </Link>
              </div>
              {saved ? (
                <p className="mt-4 text-sm text-brand-cyan">
                  აუდიო: გაგრძელება {formatTime(saved.positionSec)}-დან
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-page px-6 py-12">
        {!allowed ? (
          <div className="panel mb-12 p-8">
            <p className="font-semibold">წიგნი დაბლოკილია</p>
            {book.access === 'subscription' ? (
              <p className="mt-2 text-sm text-fg-muted">
                საჭიროა გამოწერა.{' '}
                <Link href="/pricing" className="text-brand-cyan no-underline hover:underline">
                  იხილე გეგმები
                </Link>
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-fg-muted">
                  ფასი: <strong className="text-fg">{book.priceGel} ₾</strong>
                </p>
                <button type="button" className="btn-primary mt-4" onClick={() => purchaseBook(book.id)}>
                  შეძენა (demo)
                </button>
              </>
            )}
          </div>
        ) : null}

        <FadeUp>
          <h2 className="text-lg font-semibold">აღწერა</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">{book.description}</p>
        </FadeUp>

        <FadeUp delay={0.08} className="mt-14">
          <h2 className="text-lg font-semibold">თავები</h2>
          <ol className="mt-4 divide-y divide-line rounded-xl border border-line">
            {book.chapters.map((ch, i) => (
              <li key={ch.id} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                <Link
                  href={`/read/${book.slug}?chapter=${ch.id}`}
                  className="flex flex-1 items-center text-fg no-underline hover:text-brand-indigo"
                >
                  <span className="mr-4 tabular-nums text-fg-faint">{i + 1}</span>
                  {ch.title}
                </Link>
                <span className="shrink-0 tabular-nums text-fg-muted">{formatDuration(ch.durationSec)}</span>
              </li>
            ))}
          </ol>
        </FadeUp>

        <FadeUp delay={0.12} className="mt-14">
          <h2 className="text-lg font-semibold">მსგავსი წიგნები</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((b) => (
              <BookCoverCard key={b.id} book={b} />
            ))}
          </div>
        </FadeUp>
      </div>
    </main>
  );
}

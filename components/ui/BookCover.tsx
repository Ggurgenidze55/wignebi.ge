'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { accessLabel, formatDuration } from '@/lib/access';
import { bookCoverUrl } from '@/lib/site';
import { cn } from '@/lib/cn';
import type { Book } from '@/types/book';
import Link from 'next/link';

function tierClass(access: Book['access']) {
  if (access === 'free') return 'badge-free';
  if (access === 'subscription') return 'badge-sub';
  return 'badge-premium';
}

export function CoverArt({
  book,
  size = 'md',
  className,
  tilt = false,
}: {
  book: Book;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  tilt?: boolean;
}) {
  const sizes = {
    sm: 'h-[4.5rem] w-[3rem]',
    md: 'h-48 w-32',
    lg: 'h-56 w-40',
    xl: 'h-72 w-48',
    hero: 'h-80 w-56',
  };

  const src = book.coverUrl ?? bookCoverUrl(book.slug);
  const img = (
    <img
      src={src}
      alt={book.title}
      className={cn('rounded-lg object-cover shadow-cover ring-1 ring-black/5', sizes[size], className)}
    />
  );

  if (!tilt) return img;

  return (
    <motion.div
      className="[perspective:800px]"
      whileHover={{ rotateY: -6, rotateX: 4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {img}
    </motion.div>
  );
}

export function BookCoverCard({ book }: { book: Book }) {
  const reduceMotion = useReducedMotion();

  return (
    <Link href={`/book/${book.slug}`} className="group block no-underline">
      <div className="relative">
        <CoverArt book={book} size="md" tilt />
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand-cyan opacity-0 shadow-glow-cyan group-hover:opacity-100"
            initial={false}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            aria-hidden
          />
        )}
      </div>
      <div className="mt-4">
        <span className={cn('text-[11px] font-medium uppercase tracking-wide', tierClass(book.access))}>
          {accessLabel(book)}
        </span>
        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-fg transition-colors group-hover:text-brand-indigo">
          {book.title}
        </h3>
        <p className="mt-0.5 text-xs text-fg-muted">{book.author}</p>
      </div>
    </Link>
  );
}

export function BookRowCard({ book, index }: { book: Book; index?: number }) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="group grid grid-cols-[auto_1fr] items-center gap-4 border-b border-line/80 py-4 no-underline transition-colors hover:bg-base-surface/80 sm:grid-cols-[2rem_auto_1fr_auto]"
    >
      {index !== undefined ? (
        <span className="hidden text-sm tabular-nums text-fg-faint sm:block">{index}</span>
      ) : null}
      <CoverArt book={book} size="sm" className="!h-14 !w-10" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={cn('font-medium', tierClass(book.access))}>{accessLabel(book)}</span>
          <span className="text-fg-faint">{formatDuration(book.durationSec)}</span>
        </div>
        <h3 className="mt-0.5 font-semibold text-fg group-hover:text-brand-cyan">{book.title}</h3>
        <p className="text-sm text-fg-muted">{book.author}</p>
      </div>
      <span className="hidden text-sm text-brand-indigo opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        →
      </span>
    </Link>
  );
}

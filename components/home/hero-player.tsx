'use client';

import type { Book } from '@/types/book';
import { bookCoverUrl } from '@/lib/site';
import { formatDuration } from '@/lib/access';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useCallback, useState } from 'react';

export function HeroPlayer({ book, carousel }: { book: Book; carousel?: Book[] }) {
  const cover = book.coverUrl ?? bookCoverUrl(book.slug);
  const stack = carousel?.length
    ? [carousel[1], carousel[0], carousel[2]].filter(Boolean) as Book[]
    : [book, book, book];
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 120, damping: 20 });
  const springY = useSpring(my, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my, reduceMotion],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <div
      className="relative mx-auto w-full max-w-sm lg:max-w-none"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="relative hidden h-[420px] lg:block">
        {stack.map((b, i) => {
          const offset = i - 1;
          const isCenter = i === 1;
          return (
            <motion.div
              key={b.id}
              className="animate-hero-rise absolute left-1/2 top-1/2 w-40 cursor-pointer overflow-hidden rounded-xl shadow-cover ring-1 ring-black/5"
              style={{
                zIndex: isCenter ? 3 : 1,
                rotateY: isCenter ? rotateY : 0,
                rotateX: isCenter ? rotateX : 0,
                transformPerspective: 900,
                animationDelay: `${180 + i * 90}ms`,
              }}
              animate={{
                x: offset * 72,
                y: -120 + Math.abs(offset) * 12,
                rotate: offset * 8,
              }}
              whileHover={reduceMotion ? undefined : { scale: isCenter ? 1.06 : 1.04, y: -128 + Math.abs(offset) * 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <motion.img
                src={b.coverUrl ?? bookCoverUrl(b.slug)}
                alt={b.title}
                className="aspect-[2/3] w-full object-cover"
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
              />
              {isCenter && !reduceMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-indigo/20 to-transparent opacity-0"
                  whileHover={{ opacity: 1 }}
                />
              )}
            </motion.div>
          );
        })}

        {!reduceMotion && (
          <>
            <motion.span
              className="particle-spark absolute left-[20%] top-[30%] h-2 w-2"
              animate={{ opacity: [0, 1, 0], y: [0, -20, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: 0.5 }}
              aria-hidden
            />
            <motion.span
              className="particle-firefly absolute right-[18%] top-[45%] h-2.5 w-2.5"
              animate={{ opacity: [0, 0.9, 0], x: [0, 12, 0], y: [0, -16, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1.2 }}
              aria-hidden
            />
          </>
        )}
      </div>

      <motion.div
        className="panel panel-glow animate-hero-rise mx-auto max-w-sm p-5 lg:absolute lg:bottom-0 lg:right-0 lg:max-w-xs"
        style={{ animationDelay: '380ms' }}
        whileHover={reduceMotion ? undefined : { y: -4 }}
      >
        <div className="flex gap-4">
          <motion.img
            src={cover}
            alt=""
            className="h-16 w-16 rounded-lg object-cover ring-2 ring-brand-indigo/10"
            animate={playing && !reduceMotion ? { scale: [1, 1.03, 1] } : undefined}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{book.title}</p>
            <p className="truncate text-xs text-fg-muted">{book.author}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-cyan"
                animate={{ width: playing ? ['38%', '72%', '55%'] : ['18%', '62%', '38%'] }}
                transition={{ duration: playing ? 6 : 10, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <p className="mt-1.5 text-[11px] tabular-nums text-fg-faint">
              {formatDuration(book.durationSec)} · {playing ? '▶ უკვე უსმენ' : 'დააჭირე play'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-fg-muted">
          <motion.button
            type="button"
            className="text-xs transition-colors hover:text-fg"
            whileTap={{ scale: 0.9 }}
            aria-label="15 წამით უკან"
          >
            −15
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-indigo text-sm text-white shadow-glow-indigo"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={playing ? 'პაუზა' : 'დაკვრა'}
          >
            {!reduceMotion && playing && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-brand-indigo/40"
                animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                aria-hidden
              />
            )}
            {playing ? '❚❚' : '▶'}
          </motion.button>
          <motion.button
            type="button"
            className="text-xs transition-colors hover:text-fg"
            whileTap={{ scale: 0.9 }}
            aria-label="30 წამით წინ"
          >
            +30
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

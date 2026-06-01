'use client';

import { cn } from '@/lib/cn';
import { getReadingProgress, saveReadingProgress } from '@/lib/reading-progress';
import type { Book, Chapter } from '@/types/book';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  List,
  Minus,
  Moon,
  Plus,
  Sun,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ReaderSettings = {
  theme: 'light' | 'dark';
  fontSize: number;
  lineHeight: number;
  width: 'narrow' | 'medium' | 'wide';
};

const SETTINGS_KEY = 'tsignebi-reader-settings';

const defaultSettings: ReaderSettings = {
  theme: 'light',
  fontSize: 19,
  lineHeight: 1.75,
  width: 'medium',
};

const widthClass = {
  narrow: 'max-w-xl',
  medium: 'max-w-2xl',
  wide: 'max-w-3xl',
};

function loadSettings(): ReaderSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function BookReader({
  book,
  authorName,
  genreLabel,
  initialChapterId,
  initialParagraphs = [],
}: {
  book: Book;
  authorName: string;
  genreLabel?: string;
  initialChapterId?: string;
  initialParagraphs?: string[];
}) {
  const reduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!book || !hydrated) return;
    const saved = getReadingProgress(book.slug);
    if (saved) {
      const idx = book.chapters.findIndex((c) => c.id === saved.chapterId);
      if (idx >= 0) setChapterIndex(idx);
    } else if (initialChapterId) {
      const idx = book.chapters.findIndex((c) => c.id === initialChapterId);
      if (idx >= 0) setChapterIndex(idx);
    }
  }, [book, hydrated, initialChapterId]);

  const chapter: Chapter | undefined = book?.chapters[chapterIndex];

  const [paragraphs, setParagraphs] = useState<string[]>(initialParagraphs);

  useEffect(() => {
    if (!chapter) return;
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/reading/${book.slug}/${chapter.id}`);
      if (!res.ok) {
        if (!cancelled) setParagraphs(initialParagraphs);
        return;
      }
      const data = (await res.json()) as { paragraphs: string[] };
      if (!cancelled) setParagraphs(data.paragraphs ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [book.slug, chapter?.id]);

  const persistSettings = useCallback((next: ReaderSettings) => {
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }, []);

  const onScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el || !book || !chapter) return;
    const max = el.scrollHeight - el.clientHeight;
    const pct = max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0;
    setScrollPercent(pct);
    saveReadingProgress({
      bookSlug: book.slug,
      chapterId: chapter.id,
      scrollPercent: pct,
      updatedAt: Date.now(),
    });
  }, [book, chapter]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !hydrated || !book || !chapter) return;
    const saved = getReadingProgress(book.slug);
    if (saved?.chapterId === chapter.id && saved.scrollPercent > 0) {
      const max = el.scrollHeight - el.clientHeight;
      el.scrollTop = (saved.scrollPercent / 100) * max;
      setScrollPercent(saved.scrollPercent);
    } else {
      el.scrollTop = 0;
      setScrollPercent(0);
    }
  }, [chapterIndex, book, chapter, hydrated]);

  const goChapter = (delta: number) => {
    if (!book) return;
    setChapterIndex((i) => Math.max(0, Math.min(book.chapters.length - 1, i + delta)));
    setTocOpen(false);
  };

  if (!chapter) {
    return (
      <main className="mx-auto max-w-page px-6 py-20 text-center">
        <p>წიგნი ვერ მოიძებნა.</p>
        <Link href="/library" className="btn-primary mt-6 inline-flex">
          ბიბლიოთეკა
        </Link>
      </main>
    );
  }

  const isDark = settings.theme === 'dark';
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col',
        isDark ? 'bg-[#0f1419] text-[#e8eaed]' : 'bg-[#fafbfc] text-fg',
      )}
    >
      <div
        className="h-0.5 shrink-0 bg-brand-indigo transition-all duration-150"
        style={{ width: `${scrollPercent}%` }}
        role="progressbar"
        aria-valuenow={scrollPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <header
        className={cn(
          'sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b px-4 py-3 backdrop-blur-xl sm:px-6',
          isDark ? 'border-white/10 bg-[#0f1419]/90' : 'border-line bg-white/90',
        )}
      >
        <Link
          href={`/book/${book.slug}`}
          className={cn('rounded-lg p-2 transition-colors', isDark ? 'hover:bg-white/10' : 'hover:bg-base-surface')}
          aria-label="დახურვა"
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{book.title}</p>
          <p className={cn('truncate text-xs', isDark ? 'text-white/50' : 'text-fg-muted')}>
            {chapter.title} · {chapterIndex + 1}/{book.chapters.length}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTocOpen((o) => !o)}
          className={cn('rounded-lg p-2', isDark ? 'hover:bg-white/10' : 'hover:bg-base-surface')}
          aria-label="სარჩევი"
        >
          <List className="h-5 w-5" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <AnimatePresence>
          {tocOpen ? (
            <motion.aside
              initial={reduceMotion ? false : { x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              className={cn(
                'absolute inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r p-4 pt-20 shadow-soft sm:relative sm:pt-4',
                isDark ? 'border-white/10 bg-[#151a21]' : 'border-line bg-white',
              )}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-60">სარჩევი</p>
              <ol className="space-y-1">
                {book.chapters.map((ch, i) => (
                  <li key={ch.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setChapterIndex(i);
                        setTocOpen(false);
                      }}
                      className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        i === chapterIndex
                          ? 'bg-brand-indigo/15 text-brand-indigo'
                          : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-base-surface',
                      )}
                    >
                      {i + 1}. {ch.title}
                    </button>
                  </li>
                ))}
              </ol>
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <article
          ref={contentRef}
          onScroll={onScroll}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-10 sm:px-8"
        >
          <div className={cn('mx-auto', widthClass[settings.width])}>
            {genreLabel ? (
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-cyan">{genreLabel}</p>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{chapter.title}</h1>
            <div
              className="reader-prose mt-8 space-y-6"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
              }}
            >
              {paragraphs.map((p, i) => (
                <p key={i} className={isDark ? 'text-[#d1d5db]' : 'text-fg-muted'}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>

      <footer
        className={cn(
          'sticky bottom-0 z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-6',
          isDark ? 'border-white/10 bg-[#0f1419]/95' : 'border-line bg-white/95',
        )}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={chapterIndex === 0}
            onClick={() => goChapter(-1)}
            className="btn-secondary !p-2 disabled:opacity-40"
            aria-label="წინა თავი"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={chapterIndex >= book.chapters.length - 1}
            onClick={() => goChapter(1)}
            className="btn-secondary !p-2 disabled:opacity-40"
            aria-label="შემდეგი თავი"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              persistSettings({
                ...settings,
                fontSize: Math.max(15, settings.fontSize - 1),
              })
            }
            className="btn-secondary !p-2"
            aria-label="ფონტი პატა"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2rem] text-center text-xs tabular-nums">{settings.fontSize}</span>
          <button
            type="button"
            onClick={() =>
              persistSettings({
                ...settings,
                fontSize: Math.min(26, settings.fontSize + 1),
              })
            }
            className="btn-secondary !p-2"
            aria-label="ფონტი დიდი"
          >
            <Plus className="h-4 w-4" />
          </button>
          <select
            aria-label="სიგანე"
            value={settings.width}
            onChange={(e) =>
              persistSettings({ ...settings, width: e.target.value as ReaderSettings['width'] })
            }
            className="rounded-lg border border-line bg-transparent px-2 py-1.5 text-xs"
          >
            <option value="narrow">ვიწრო</option>
            <option value="medium">საშუალო</option>
            <option value="wide">ფართო</option>
          </select>
          <select
            aria-label="ხაზის სივრცე"
            value={settings.lineHeight}
            onChange={(e) =>
              persistSettings({ ...settings, lineHeight: Number(e.target.value) })
            }
            className="rounded-lg border border-line bg-transparent px-2 py-1.5 text-xs"
          >
            <option value={1.5}>კომპაქტური</option>
            <option value={1.75}>სტანდარტი</option>
            <option value={2}>ფართო</option>
          </select>
          <button
            type="button"
            onClick={() =>
              persistSettings({
                ...settings,
                theme: isDark ? 'light' : 'dark',
              })
            }
            className="btn-secondary !p-2"
            aria-label="თემა"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
}

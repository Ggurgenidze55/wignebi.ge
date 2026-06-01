'use client';

import type { ReadingProgress } from '@/types/book';

const KEY = 'tsignebi-reading-progress';

function readAll(): Record<string, ReadingProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReadingProgress>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, ReadingProgress>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getReadingProgress(bookSlug: string): ReadingProgress | undefined {
  return readAll()[bookSlug];
}

export function saveReadingProgress(progress: ReadingProgress) {
  const all = readAll();
  all[progress.bookSlug] = { ...progress, updatedAt: Date.now() };
  writeAll(all);
}

export function clearReadingProgress(bookSlug: string) {
  const all = readAll();
  delete all[bookSlug];
  writeAll(all);
}

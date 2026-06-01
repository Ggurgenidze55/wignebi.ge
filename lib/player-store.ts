'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, Chapter, PlaybackProgress, UserPlan } from '@/types/book';
import { canListen } from '@/lib/access';

type PlayerState = {
  book: Book | null;
  chapter: Chapter | null;
  isPlaying: boolean;
  positionSec: number;
  durationSec: number;
  plan: UserPlan;
  purchasedIds: string[];
  progressMap: Record<string, PlaybackProgress>;

  setPlan: (plan: UserPlan) => void;
  purchaseBook: (bookId: string) => void;
  loadBook: (book: Book, chapterIndex?: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (sec: number) => void;
  setPosition: (sec: number) => void;
  setDuration: (sec: number) => void;
  saveProgress: () => void;
  getSavedProgress: (bookId: string) => PlaybackProgress | undefined;
  canPlayCurrent: () => boolean;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      book: null,
      chapter: null,
      isPlaying: false,
      positionSec: 0,
      durationSec: 0,
      plan: 'guest',
      purchasedIds: [],
      progressMap: {},

      setPlan: (plan) => set({ plan }),

      purchaseBook: (bookId) =>
        set((s) => ({
          purchasedIds: s.purchasedIds.includes(bookId)
            ? s.purchasedIds
            : [...s.purchasedIds, bookId],
          plan: 'premium_buyer',
        })),

      loadBook: (book, chapterIndex = 0) => {
        const chapter = book.chapters[chapterIndex] ?? book.chapters[0];
        const saved = get().progressMap[book.id];
        const positionSec =
          saved?.chapterId === chapter?.id ? saved.positionSec : 0;
        set({
          book,
          chapter,
          positionSec,
          durationSec: chapter?.durationSec ?? 0,
          isPlaying: false,
        });
      },

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),

      seek: (sec) => set({ positionSec: Math.max(0, sec) }),

      setPosition: (positionSec) => set({ positionSec }),
      setDuration: (durationSec) => set({ durationSec }),

      saveProgress: () => {
        const { book, chapter, positionSec, progressMap } = get();
        if (!book || !chapter) return;
        set({
          progressMap: {
            ...progressMap,
            [book.id]: {
              bookId: book.id,
              chapterId: chapter.id,
              positionSec,
              updatedAt: Date.now(),
            },
          },
        });
      },

      getSavedProgress: (bookId) => get().progressMap[bookId],

      canPlayCurrent: () => {
        const { book, plan, purchasedIds } = get();
        if (!book) return false;
        return canListen(book, plan, purchasedIds);
      },
    }),
    {
      name: 'audiotsignebi-player',
      partialize: (s) => ({
        plan: s.plan,
        purchasedIds: s.purchasedIds,
        progressMap: s.progressMap,
      }),
    },
  ),
);

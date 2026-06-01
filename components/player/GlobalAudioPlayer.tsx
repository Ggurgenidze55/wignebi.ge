'use client';

import { usePlayerStore } from '@/lib/player-store';
import { formatTime } from '@/lib/access';
import { CoverArt } from '@/components/ui/BookCover';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

export function GlobalAudioPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const saveTimer = useRef<ReturnType<typeof setInterval>>();

  const {
    book,
    chapter,
    isPlaying,
    positionSec,
    durationSec,
    toggle,
    pause,
    setPosition,
    setDuration,
    saveProgress,
    canPlayCurrent,
  } = usePlayerStore();

  const syncMediaSession = useCallback(() => {
    if (!book || !chapter || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: chapter.title,
      artist: book.narrator,
      album: book.title,
    });
    navigator.mediaSession.setActionHandler('play', () => usePlayerStore.getState().play());
    navigator.mediaSession.setActionHandler('pause', () => usePlayerStore.getState().pause());
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      const s = usePlayerStore.getState();
      s.seek(Math.max(0, s.positionSec - 15));
    });
    navigator.mediaSession.setActionHandler('seekforward', () => {
      const s = usePlayerStore.getState();
      s.seek(s.positionSec + 30);
    });
  }, [book, chapter]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !chapter) return;
    if (el.src !== chapter.audioUrl) {
      el.src = chapter.audioUrl;
      el.currentTime = positionSec;
    }
  }, [chapter, positionSec]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying && canPlayCurrent()) {
      el.play().catch(() => pause());
    } else {
      el.pause();
    }
  }, [isPlaying, canPlayCurrent, pause, chapter]);

  useEffect(() => {
    syncMediaSession();
  }, [syncMediaSession]);

  useEffect(() => {
    saveTimer.current = setInterval(() => saveProgress(), 4000);
    return () => clearInterval(saveTimer.current);
  }, [saveProgress]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') saveProgress();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [saveProgress]);

  if (pathname?.startsWith('/read/') || !book || !chapter) return null;

  const progress = durationSec > 0 ? (positionSec / durationSec) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || chapter.durationSec)}
        onEnded={() => {
          pause();
          saveProgress();
        }}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-base-raised/95 shadow-soft backdrop-blur-xl">
        <div className="h-0.5 bg-line">
          <div className="h-full bg-brand-indigo transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
        <div className="mx-auto flex max-w-page items-center gap-3 px-4 py-2.5 sm:gap-4">
          <CoverArt book={book} size="sm" className="!h-11 !w-11 hidden sm:block" />
          <div className="min-w-0 flex-1">
            <Link
              href={`/book/${book.slug}`}
              className="block truncate text-sm font-medium text-fg no-underline hover:text-brand-cyan"
            >
              {book.title}
            </Link>
            <p className="truncate text-xs text-fg-muted">{chapter.title}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="15 წამით უკან"
              className="rounded-lg p-2 text-fg-muted hover:text-fg"
              onClick={() => usePlayerStore.getState().seek(Math.max(0, positionSec - 15))}
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'პაუზა' : 'დაკვრა'}
              disabled={!canPlayCurrent()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-indigo text-white disabled:opacity-40"
              onClick={toggle}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" fill="currentColor" />}
            </button>
            <button
              type="button"
              aria-label="30 წამით წინ"
              className="rounded-lg p-2 text-fg-muted hover:text-fg"
              onClick={() => usePlayerStore.getState().seek(positionSec + 30)}
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
          <span className="hidden tabular-nums text-xs text-fg-faint sm:block">
            {formatTime(positionSec)} / {formatTime(durationSec || chapter.durationSec)}
          </span>
        </div>
      </div>
    </>
  );
}

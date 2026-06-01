'use client';

import { cn } from '@/lib/cn';

export function AnimatedWaveform({
  bars = 32,
  className,
  playing = true,
}: {
  bars?: number;
  className?: string;
  playing?: boolean;
}) {
  return (
    <div className={cn('flex h-12 items-end justify-center gap-[3px]', className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 origin-bottom rounded-full bg-gradient-to-t from-accent-violet to-accent-cyan',
            playing && 'animate-wave-bar',
          )}
          style={{
            height: `${20 + Math.sin(i * 0.7) * 30 + (i % 3) * 8}%`,
            animationDelay: playing ? `${i * 0.04}s` : undefined,
            animationPlayState: playing ? 'running' : 'paused',
            opacity: 0.4 + (i % 5) * 0.12,
          }}
        />
      ))}
    </div>
  );
}

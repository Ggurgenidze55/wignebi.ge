'use client';

import { cn } from '@/lib/cn';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  kind: 'firefly' | 'spark';
};

export function AmbientSparks({
  count = 28,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: seededRandom(i * 1.17) * 100,
        y: seededRandom(i * 2.41) * 100,
        size: 2 + seededRandom(i * 3.83) * 5,
        delay: seededRandom(i * 4.29) * 6,
        duration: 4 + seededRandom(i * 5.71) * 5,
        kind: seededRandom(i * 6.13) > 0.65 ? 'firefly' : 'spark',
      })),
    [count],
  );

  if (reduceMotion) return null;

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={p.kind === 'firefly' ? 'particle-firefly' : 'particle-spark'}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, 0.85, 0.35, 0.75, 0],
            y: [0, -18 - p.size * 2, -6, -28 - p.size, 0],
            x: [0, 10, -8, 5, 0],
            scale: [0.5, 1.15, 0.85, 1.05, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

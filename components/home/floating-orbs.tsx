'use client';

import { cn } from '@/lib/cn';
import { motion, useReducedMotion } from 'framer-motion';

const orbs = [
  { className: 'left-[8%] top-[12%] h-72 w-72 bg-brand-indigo/20', duration: 22, x: 24, y: -18 },
  { className: 'right-[5%] top-[8%] h-56 w-56 bg-brand-cyan/15', duration: 18, x: -20, y: 14 },
  { className: 'bottom-[10%] left-[35%] h-64 w-64 bg-brand-violet/12', duration: 26, x: 16, y: -12 },
];

export function FloatingOrbs({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={cn('orb-blur absolute rounded-full', orb.className)}
          animate={{ x: [0, orb.x, -orb.x / 2, 0], y: [0, orb.y, -orb.y, 0] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

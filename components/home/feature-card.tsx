'use client';

import { cn } from '@/lib/cn';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Headphones, Library } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: LucideIcon[] = [Headphones, BookOpen, Library];
const hoverGlow = [
  'hover:shadow-glow-indigo',
  'hover:shadow-glow-cyan',
  'hover:shadow-glow-violet',
];

export function FeatureCard({
  title,
  desc,
  index,
}: {
  title: string;
  desc: string;
  index: number;
}) {
  const Icon = icons[index] ?? BookOpen;
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-line/80 bg-white/80 p-6 backdrop-blur-sm transition-shadow',
        hoverGlow[index],
        !reduceMotion && 'animate-hero-rise',
      )}
      style={!reduceMotion ? { animationDelay: `${index * 100}ms` } : undefined}
      initial={false}
      whileInView={reduceMotion ? undefined : { y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {!reduceMotion && (
        <span
          className="pointer-events-none absolute right-4 top-4 h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-cyan/80"
          aria-hidden
        />
      )}

      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-brand-indigo/10 to-transparent p-3 text-brand-indigo">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <h2 className="text-base font-semibold text-fg">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{desc}</p>

      <div className="mt-5 h-px w-full bg-gradient-to-r from-brand-indigo/30 via-brand-cyan/20 to-transparent" />
    </motion.article>
  );
}

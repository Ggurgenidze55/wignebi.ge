'use client';

import { site } from '@/lib/site';
import { cn } from '@/lib/cn';
import { motion, useReducedMotion } from 'framer-motion';

const lines = ['წაიკითხე', 'მოუსმინე', 'ისწავლე'];

const pillLabels = ['500+ წიგნი', 'აუდიო + ელწიგნი', '7 დღე უფასოდ'];

export function HeroHeadline() {
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <p className="sr-only">{site.seoH1}</p>

      <div
        className="mb-6 inline-flex animate-hero-rise items-center gap-2 rounded-full border border-brand-indigo/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-brand-indigo shadow-sm backdrop-blur-sm"
        style={{ animationDelay: '0ms' }}
      >
        <span
          className={cn(
            'inline-block h-2 w-2 rounded-full bg-emerald-400',
            !reduceMotion && 'animate-pulse-soft',
          )}
        />
        ახლა უსმენენ 128+ მკითხველი
      </div>

      <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-fg lg:text-[3.25rem]">
        {lines.map((line, i) => (
          <span
            key={line}
            className="block animate-hero-rise"
            style={{ animationDelay: `${80 + i * 120}ms` }}
          >
            <span className={i === 1 ? 'text-shimmer' : ''}>{line}.</span>
          </span>
        ))}
      </h1>

      <p
        className="mt-6 max-w-lg animate-hero-rise text-lg leading-relaxed text-fg-muted"
        style={{ animationDelay: '450ms' }}
      >
        ათასობით წიგნი და აუდიოწიგნი ერთ პლატფორმაზე — ისე, თითქოს შენს ოთახში პიპილები ფრენენ.
      </p>

      <div className="mt-8 flex animate-hero-rise flex-wrap gap-2" style={{ animationDelay: '600ms' }}>
        {pillLabels.map((label) => (
          <motion.span
            key={label}
            className="rounded-full border border-line/80 bg-white/60 px-3 py-1 text-xs text-fg-muted backdrop-blur-sm"
            whileHover={reduceMotion ? undefined : { y: -2, borderColor: 'rgba(79, 70, 229, 0.25)', color: '#0F172A' }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            ✦ {label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

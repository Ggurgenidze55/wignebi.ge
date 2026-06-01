'use client';

import { cn } from '@/lib/cn';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { ComponentProps } from 'react';

type SpringLinkProps = ComponentProps<typeof Link> & {
  variant?: 'primary' | 'secondary';
};

export function SpringLink({ className, variant = 'primary', children, ...props }: SpringLinkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="inline-block"
      whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      <Link
        className={cn(variant === 'primary' ? 'btn-primary btn-glow' : 'btn-secondary', className)}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
}

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { site } from '@/lib/site';

const links = [
  { href: '/library', label: 'ბიბლიოთეკა' },
  { href: '/audiobooks', label: 'აუდიოწიგნები' },
  { href: '/authors', label: 'ავტორები' },
  { href: '/genres', label: 'ჟანრები' },
  { href: '/pricing', label: 'გამოწერა' },
];

export function SiteHeader() {
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-base-raised/85 backdrop-blur-xl">
      <div className="site-header-bar mx-auto max-w-page px-6">
        <Link href="/" className="group text-[15px] font-semibold tracking-tight text-fg no-underline">
          <motion.span whileHover={reduceMotion ? undefined : { scale: 1.02 }} className="inline-flex items-center gap-1">
            {site.name}
            <span className="text-fg-muted">.ge</span>
            {!reduceMotion && (
              <motion.span
                className="text-brand-cyan opacity-0 group-hover:opacity-100"
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden
              >
                ✦
              </motion.span>
            )}
          </motion.span>
        </Link>
        <nav className="site-nav hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="link-muted text-[13px]">
              {l.label}
            </Link>
          ))}
        </nav>
        <motion.div whileHover={reduceMotion ? undefined : { scale: 1.04 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
          <Link href="/library" className="btn-primary btn-glow !py-2 !text-[13px]">
            დაიწყე უფასოდ
          </Link>
        </motion.div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-6 py-16 md:flex-row md:justify-between">
        <div>
          <p className="text-lg font-semibold">{site.domain}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">{site.description}</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <Link href="/library" className="link-muted">
            ბიბლიოთეკა
          </Link>
          <Link href="/audiobooks" className="link-muted">
            აუდიოწიგნები
          </Link>
          <Link href="/authors" className="link-muted">
            ავტორები
          </Link>
          <Link href="/genres" className="link-muted">
            ჟანრები
          </Link>
          <Link href="/pricing" className="link-muted">
            ფასები
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-page px-6 pb-10 text-xs text-fg-faint">© {new Date().getFullYear()}</div>
    </footer>
  );
}

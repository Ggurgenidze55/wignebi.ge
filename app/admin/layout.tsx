import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'CMS Admin | Tsignebi',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-fg">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-semibold no-underline">
            Tsignebi CMS
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/books" className="link-muted">
              წიგნები
            </Link>
            <Link href="/admin/authors" className="link-muted">
              ავტორები
            </Link>
            <Link href="/admin/genres" className="link-muted">
              ჟანრები
            </Link>
            <Link href="/" className="link-muted">
              საიტი →
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}

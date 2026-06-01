'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-page flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-medium text-brand-indigo">✦</p>
      <h1 className="mt-4 text-2xl font-semibold text-fg">რაღაც შეცდომა მოხდა</h1>
      <p className="mt-3 max-w-md text-sm text-fg-muted">
        გვერდი ვერ ჩაიტვირთა. სცადე თავიდან — ჩვეულებრივ cache-ის გასუფთავება ეხმარება.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          თავიდან ცდა
        </button>
        <Link href="/" className="btn-secondary">
          მთავარი
        </Link>
      </div>
    </main>
  );
}

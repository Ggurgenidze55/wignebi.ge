import { LibraryClient } from '@/app/library/LibraryClient';
import { getAllBooks } from '@/lib/cms/catalog';
import { Suspense } from 'react';

export default async function LibraryPage() {
  const books = await getAllBooks();
  return (
    <Suspense fallback={<div className="p-12 text-fg-muted">იტვირთება…</div>}>
      <LibraryClient books={books} />
    </Suspense>
  );
}

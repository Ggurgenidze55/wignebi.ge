'use client';

import type { Book } from '@/types/book';
import { adminFetch } from '@/lib/cms/admin-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminTrashPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    adminFetch<Book[]>('books?trash=1').then(setBooks).catch(console.error);
  }, []);

  async function restore(id: string) {
    await adminFetch(`books/${id}/restore`, { method: 'POST' });
    setBooks((b) => b.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Trash</h1>
      <p className="mt-2 text-fg-muted">წაშლილი წიგნები — აღდგენა ან სამუდამო წაშლა (ADMIN)</p>
      <ul className="mt-6 space-y-2">
        {books.map((b) => (
          <li key={b.id} className="panel flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{b.title}</p>
              <p className="text-xs text-fg-muted">{b.slug}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary text-xs" onClick={() => restore(b.id)}>
                აღდგენა
              </button>
              <Link href={`/admin/books/${b.id}`} className="text-xs text-fg-muted">
                ნახვა
              </Link>
            </div>
          </li>
        ))}
        {!books.length ? <p className="text-fg-muted">ცარიელია</p> : null}
      </ul>
    </div>
  );
}

'use client';

import type { Book } from '@/types/book';
import { adminFetch } from '@/lib/cms/admin-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch<Book[]>('books')
      .then(setBooks)
      .catch((e) => setError(String(e)));
  }, []);

  async function remove(id: string) {
    if (!confirm('წავშალოთ?')) return;
    await adminFetch(`books/${id}`, { method: 'DELETE' });
    setBooks((b) => b.filter((x) => x.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">წიგნები</h1>
        <Link href="/admin/books/new" className="btn-primary text-sm">
          + ახალი
        </Link>
      </div>
      {error ? <p className="mt-4 text-red-600">{error}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-base-raised/50">
            <tr>
              <th className="p-3">სათაური</th>
              <th className="p-3">ავტორი</th>
              <th className="p-3">access</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-b border-line/60">
                <td className="p-3">
                  <Link href={`/admin/books/${b.id}`} className="font-medium">
                    {b.title}
                  </Link>
                  <div className="text-xs text-fg-muted">{b.slug}</div>
                </td>
                <td className="p-3">{b.author}</td>
                <td className="p-3">{b.access}</td>
                <td className="p-3 text-right">
                  <button type="button" className="text-red-600 text-xs" onClick={() => remove(b.id)}>
                    წაშლა
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

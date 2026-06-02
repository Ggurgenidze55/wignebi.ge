'use client';

import type { Book } from '@/types/book';
import { adminFetch } from '@/lib/cms/admin-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

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

  const filtered = books.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">წიგნები</h1>
        <Link href="/admin/books/new" className="btn-primary text-sm">
          + ახალი
        </Link>
      </div>
      <div className="mt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ძებნა წიგნით / slug-ით / ავტორით"
          className="w-full max-w-md rounded-lg border border-line px-3 py-2 text-sm"
        />
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
            {filtered.map((b) => (
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
                  <Link href={`/admin/books/${b.id}`} className="mr-3 text-xs text-brand-indigo">
                    რედაქტირება
                  </Link>
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

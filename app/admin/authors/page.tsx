'use client';

import type { Author } from '@/types/catalog';
import { adminFetch } from '@/lib/cms/admin-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminAuthorsPage() {
  const [items, setItems] = useState<Author[]>([]);
  const [form, setForm] = useState({ slug: '', name: '', bio: '' });

  useEffect(() => {
    adminFetch<Author[]>('authors').then(setItems);
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const created = await adminFetch<Author>('authors', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setItems((list) => [...list, created]);
    setForm({ slug: '', name: '', bio: '' });
  }

  async function remove(id: string) {
    if (!confirm('წავშალოთ?')) return;
    await adminFetch(`authors/${id}`, { method: 'DELETE' });
    setItems((list) => list.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">ავტორები</h1>
      <form onSubmit={create} className="panel mt-6 grid gap-3 p-4 sm:grid-cols-3">
        <input placeholder="slug" className="rounded border px-3 py-2 text-sm" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <input placeholder="სახელი" className="rounded border px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="bio" className="rounded border px-3 py-2 text-sm" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
        <button type="submit" className="btn-primary sm:col-span-3">
          დამატება
        </button>
      </form>
      <ul className="mt-8 space-y-2">
        {items.map((a) => (
          <li key={a.id} className="panel flex items-center justify-between p-4">
            <div>
              <Link href={`/authors/${a.slug}`} className="font-medium">
                {a.name}
              </Link>
              <span className="ml-2 text-xs text-fg-muted">{a.slug}</span>
            </div>
            <button type="button" className="text-xs text-red-600" onClick={() => remove(a.id)}>
              წაშლა
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

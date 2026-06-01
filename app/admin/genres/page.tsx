'use client';

import type { Genre } from '@/types/catalog';
import { adminFetch } from '@/lib/cms/admin-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminGenresPage() {
  const [items, setItems] = useState<Genre[]>([]);
  const [form, setForm] = useState({ slug: '', name: '', nameEn: '', description: '' });

  useEffect(() => {
    adminFetch<Genre[]>('genres').then(setItems);
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const created = await adminFetch<Genre>('genres', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setItems((list) => [...list, created]);
    setForm({ slug: '', name: '', nameEn: '', description: '' });
  }

  async function remove(id: string) {
    if (!confirm('წავშალოთ?')) return;
    await adminFetch(`genres/${id}`, { method: 'DELETE' });
    setItems((list) => list.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">ჟანრები</h1>
      <form onSubmit={create} className="panel mt-6 grid gap-3 p-4 sm:grid-cols-2">
        <input placeholder="slug" className="rounded border px-3 py-2 text-sm" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <input placeholder="სახელი (ka)" className="rounded border px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="nameEn" className="rounded border px-3 py-2 text-sm" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
        <input placeholder="აღწერა" className="rounded border px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit" className="btn-primary sm:col-span-2">
          დამატება
        </button>
      </form>
      <ul className="mt-8 space-y-2">
        {items.map((g) => (
          <li key={g.id} className="panel flex items-center justify-between p-4">
            <div>
              <Link href={`/genres/${g.slug}`} className="font-medium">
                {g.name}
              </Link>
              <span className="ml-2 text-xs text-fg-muted">{g.slug}</span>
            </div>
            <button type="button" className="text-xs text-red-600" onClick={() => remove(g.id)}>
              წაშლა
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { adminFetch } from '@/lib/cms/admin-api';
import { useEffect, useState } from 'react';

type Stats = {
  totalBooks: number;
  publishedBooks: number;
  unpublishedBooks: number;
  totalAuthors: number;
  totalGenres: number;
  recentActivity: {
    id: string;
    action: string;
    entityLabel: string | null;
    userEmail: string | null;
    createdAt: string;
  }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminFetch<Stats>('dashboard/stats').then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p className="text-fg-muted">იტვირთება…</p>;

  const cards = [
    { label: 'წიგნები', value: stats.totalBooks, sub: `${stats.publishedBooks} გამოქვეყნებული` },
    { label: 'გამოუქვეყნებელი', value: stats.unpublishedBooks, sub: 'draft / hidden' },
    { label: 'ავტორები', value: stats.totalAuthors, sub: 'აქტიური' },
    { label: 'ჟანრები', value: stats.totalGenres, sub: 'აქტიური' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-fg-muted">CMS სტატისტიკა და ბოლო აქტივობა</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="panel p-5">
            <p className="text-sm text-fg-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{c.value}</p>
            <p className="mt-1 text-xs text-brand-cyan">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="panel mt-8 p-6">
        <h2 className="font-semibold">ბოლო აქტივობა</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {stats.recentActivity.map((a) => (
            <li key={a.id} className="flex flex-wrap justify-between gap-2 border-b border-line/60 py-2">
              <span>
                <span className="font-medium">{a.action}</span>
                {a.entityLabel ? ` · ${a.entityLabel}` : null}
              </span>
              <span className="text-fg-muted">
                {a.userEmail ?? '—'} · {new Date(a.createdAt).toLocaleString('ka-GE')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

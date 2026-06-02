'use client';

import { adminFetch } from '@/lib/cms/admin-api';
import { useEffect, useMemo, useState } from 'react';

type CustomerRow = {
  id: string;
  email: string;
  fullName?: string | null;
  currentPlan: 'FREE' | 'STANDARD' | 'PREMIUM';
  subscriptionEnds?: string | null;
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [serviceUnavailable, setServiceUnavailable] = useState(false);

  async function load() {
    try {
      const data = await adminFetch<CustomerRow[]>('customers');
      setRows(data);
      setServiceUnavailable(false);
    } catch (e) {
      const msg = String(e);
      if (msg.includes('404')) {
        setServiceUnavailable(true);
        setError(
          'Users სერვისი ჯერ არ არის ატვირთული API-ში. რამდენიმე წუთში განახლდება deployment-ის შემდეგ.',
        );
      } else {
        setError(msg);
      }
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.email, r.fullName ?? '', r.currentPlan].join(' ').toLowerCase().includes(q),
    );
  }, [rows, query]);

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await adminFetch('customers', {
        method: 'POST',
        body: JSON.stringify({ email, fullName }),
      });
      setEmail('');
      setFullName('');
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function grant30Days(id: string) {
    await adminFetch(`customers/${id}/subscribe-30`, { method: 'POST' });
    await load();
  }

  async function cancelSubscription(id: string) {
    await adminFetch(`customers/${id}/cancel-subscription`, { method: 'POST' });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">მომხმარებლები და საბსქრიფშენი</h1>
      <p className="mt-2 text-fg-muted">
        30 დღიანი პაკეტი აქტიურდება გადახდის შემდეგ და ვადის გასვლისას ავტომატურად ითიშება.
      </p>

      <form onSubmit={createCustomer} className="panel mt-6 grid gap-3 p-4 sm:grid-cols-3">
        <input
          type="email"
          required
          placeholder="email"
          className="rounded border border-line px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="სახელი (optional)"
          className="rounded border border-line px-3 py-2 text-sm"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <button className="btn-primary text-sm" type="submit">
          + მომხმარებლის დამატება
        </button>
      </form>

      <div className="mt-4">
        <input
          className="w-full max-w-md rounded-lg border border-line px-3 py-2 text-sm"
          placeholder="ძებნა email/სახელი/პაკეტი"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-base-raised/50">
            <tr>
              <th className="p-3">მომხმარებელი</th>
              <th className="p-3">პაკეტი</th>
              <th className="p-3">გადახდილია/აქტიურია</th>
              <th className="p-3 text-right">მართვა</th>
            </tr>
          </thead>
          <tbody>
            {!serviceUnavailable &&
              filtered.map((r) => {
              const active = r.subscriptionEnds ? new Date(r.subscriptionEnds) > new Date() : false;
              return (
                <tr key={r.id} className="border-b border-line/60">
                  <td className="p-3">
                    <p className="font-medium">{r.fullName || '—'}</p>
                    <p className="text-xs text-fg-muted">{r.email}</p>
                  </td>
                  <td className="p-3">{r.currentPlan}</td>
                  <td className="p-3">
                    {r.subscriptionEnds ? new Date(r.subscriptionEnds).toLocaleString('ka-GE') : '—'}
                    <div className={`text-xs ${active ? 'text-green-600' : 'text-red-600'}`}>
                      {active ? 'აქტიური' : 'ვადაგასული / inactive'}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      className="mr-2 text-xs text-brand-indigo"
                      onClick={() => grant30Days(r.id)}
                    >
                      +30 დღე
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => cancelSubscription(r.id)}
                    >
                      გაუთიშე
                    </button>
                  </td>
                </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

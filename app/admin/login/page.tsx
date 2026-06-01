'use client';

import { adminLogin } from '@/lib/cms/admin-api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@tsignebi.ge');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(email, password);
      router.push('/admin/books');
    } catch {
      setError('ელფოსტა ან პაროლი არასწორია');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Admin შესვლა</h1>
      <form onSubmit={onSubmit} className="panel mt-6 space-y-4 p-6">
        <label className="block text-sm">
          <span className="text-fg-muted">ელფოსტა</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-fg-muted">პაროლი</span>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? '…' : 'შესვლა'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { adminFetch } from '@/lib/cms/admin-api';
import { useEffect, useState } from 'react';

type Log = {
  id: string;
  action: string;
  entityType: string | null;
  entityLabel: string | null;
  userEmail: string | null;
  createdAt: string;
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    adminFetch<Log[]>('audit').then(setLogs).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Audit Log</h1>
      <p className="mt-2 text-fg-muted">ADMIN only · ყველა კრიტიკული მოქმედება</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-base-raised/50">
            <tr>
              <th className="p-3">დრო</th>
              <th className="p-3">მომხმარებელი</th>
              <th className="p-3">მოქმედება</th>
              <th className="p-3">Entity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-line/60">
                <td className="p-3 whitespace-nowrap text-fg-muted">
                  {new Date(l.createdAt).toLocaleString('ka-GE')}
                </td>
                <td className="p-3">{l.userEmail ?? '—'}</td>
                <td className="p-3 font-medium">{l.action}</td>
                <td className="p-3">
                  {l.entityType ? `${l.entityType}: ` : ''}
                  {l.entityLabel ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { adminFetch, adminUpload } from '@/lib/cms/admin-api';
import { useCallback, useEffect, useState } from 'react';

type MediaRow = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  mediaType: string;
  duplicate?: boolean;
};

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaRow[]>([]);
  const [q, setQ] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    adminFetch<MediaRow[]>(`media?q=${encodeURIComponent(q)}`).then(setFiles).catch(console.error);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function onFiles(list: FileList | File[]) {
    const arr = Array.from(list);
    for (const file of arr) {
      setProgress(0);
      setError('');
      try {
        const row = (await adminUpload(file, setProgress)) as MediaRow;
        if (!row.duplicate) setFiles((f) => [row, ...f]);
      } catch (e) {
        const msg = String(e);
        if (msg.includes('403')) {
          setError('ატვირთვა უარყოფილია (403): storage/R2 წვდომა ან API უფლებებია შესასწორებელი.');
        } else if (msg.includes('401')) {
          setError('სესია დასრულდა, გთხოვ თავიდან შეხვიდე ადმინში.');
        } else {
          setError('ატვირთვა ვერ შესრულდა. სცადე თავიდან ან მომწერე error დეტალი.');
        }
      }
    }
    setProgress(null);
  }

  async function remove(id: string) {
    if (!confirm('წავშალოთ?')) return;
    await adminFetch(`/media/${id}`, { method: 'DELETE' });
    setFiles((f) => f.filter((x) => x.id !== id));
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Media Library</h1>
      <p className="mt-2 text-fg-muted">Cloudflare R2 · JPG PNG WEBP MP3 PDF EPUB</p>

      <div
        className={`panel mt-6 border-2 border-dashed p-10 text-center transition ${drag ? 'border-brand-indigo bg-brand-indigo/5' : 'border-line'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-fg-muted">ჩააგდე ფაილები ან აირჩიე</p>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.mp3,.pdf,.epub"
          className="mt-4 text-sm"
          onChange={(e) => e.target.files && onFiles(e.target.files)}
        />
        {progress !== null ? (
          <div className="mx-auto mt-4 max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-brand-indigo transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-fg-muted">{progress}%</p>
          </div>
        ) : null}
      </div>

      <input
        className="mt-6 w-full max-w-md rounded-lg border border-line px-3 py-2 text-sm"
        placeholder="ძებნა…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {files.map((f) => (
          <li key={f.id} className="panel flex gap-3 p-4">
            {f.mimeType.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.url} alt="" className="h-16 w-16 rounded object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded bg-base-raised text-xs uppercase">
                {f.mediaType}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">{f.originalName}</p>
              <p className="text-xs text-fg-muted">{(f.sizeBytes / 1024).toFixed(0)} KB</p>
              <div className="mt-2 flex gap-2">
                <button type="button" className="text-xs text-brand-indigo" onClick={() => copy(f.url)}>
                  Copy URL
                </button>
                <button type="button" className="text-xs text-red-600" onClick={() => remove(f.id)}>
                  წაშლა
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

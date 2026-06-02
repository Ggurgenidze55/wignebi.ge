'use client';

import type { Book } from '@/types/book';
import type { Author, Genre } from '@/types/catalog';
import { adminFetch } from '@/lib/cms/admin-api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ChapterInput = { title: string; durationSec: number; audioUrl?: string };

export function BookForm({ bookId }: { bookId?: string }) {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(!!bookId);
  const [error, setError] = useState('');

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [narrator, setNarrator] = useState('');
  const [authorSlug, setAuthorSlug] = useState('');
  const [access, setAccess] = useState<Book['access']>('free');
  const [genreSlugs, setGenreSlugs] = useState('');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [chapters, setChapters] = useState<ChapterInput[]>([
    { title: 'შესავალი', durationSec: 600, audioUrl: '' },
  ]);

  useEffect(() => {
    Promise.all([adminFetch<Author[]>('authors'), adminFetch<Genre[]>('genres')]).then(([a, g]) => {
      setAuthors(a);
      setGenres(g);
      if (a[0]) setAuthorSlug(a[0].slug);
    });
  }, []);

  useEffect(() => {
    if (!bookId) return;
    adminFetch<Book>(`books/${bookId}`)
      .then((b) => {
        setSlug(b.slug);
        setTitle(b.title);
        setDescription(b.description);
        setSeoTitle((b as Book & { seoTitle?: string }).seoTitle ?? '');
        setSeoDescription((b as Book & { seoDescription?: string }).seoDescription ?? '');
        setSeoKeywords(((b as Book & { seoKeywords?: string[] }).seoKeywords ?? []).join(', '));
        setNarrator(b.narrator);
        setAuthorSlug(b.authorSlug);
        setAccess(b.access);
        setGenreSlugs(b.genreSlugs.join(', '));
        setPublishedAt(b.publishedAt);
        setChapters(
          b.chapters.map((c) => ({
            title: c.title,
            durationSec: c.durationSec,
            audioUrl: c.audioUrl,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [bookId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const body = {
      slug,
      title,
      description,
      narrator,
      authorSlug,
      access,
      genreSlugs: genreSlugs.split(',').map((s) => s.trim()).filter(Boolean),
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords.split(',').map((s) => s.trim()).filter(Boolean),
      publishedAt,
      chapters,
    };
    try {
      if (bookId) {
        await adminFetch(`books/${bookId}`, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await adminFetch('books', { method: 'POST', body: JSON.stringify(body) });
      }
      router.push('/admin/books');
    } catch (err) {
      setError(String(err));
    }
  }

  if (loading) return <p>იტვირთება…</p>;

  return (
    <form onSubmit={onSubmit} className="panel max-w-2xl space-y-4 p-6">
      <label className="block text-sm">
        slug
        <input className="mt-1 w-full rounded border border-line px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </label>
      <label className="block text-sm">
        სათაური
        <input className="mt-1 w-full rounded border border-line px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="block text-sm">
        აღწერა
        <textarea className="mt-1 w-full rounded border border-line px-3 py-2" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <label className="block text-sm">
        მოთხრობი
        <input className="mt-1 w-full rounded border border-line px-3 py-2" value={narrator} onChange={(e) => setNarrator(e.target.value)} required />
      </label>
      <label className="block text-sm">
        ავტორი
        <select className="mt-1 w-full rounded border border-line px-3 py-2" value={authorSlug} onChange={(e) => setAuthorSlug(e.target.value)}>
          {authors.map((a) => (
            <option key={a.id} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        access
        <select className="mt-1 w-full rounded border border-line px-3 py-2" value={access} onChange={(e) => setAccess(e.target.value as Book['access'])}>
          <option value="free">free</option>
          <option value="subscription">subscription</option>
          <option value="premium">premium</option>
        </select>
      </label>
      <label className="block text-sm">
        ჟანრები (slug-ები მძიმით)
        <input className="mt-1 w-full rounded border border-line px-3 py-2" value={genreSlugs} onChange={(e) => setGenreSlugs(e.target.value)} placeholder={genres.slice(0, 3).map((g) => g.slug).join(', ')} />
      </label>
      <label className="block text-sm">
        გამოქვეყნება
        <input type="date" className="mt-1 w-full rounded border border-line px-3 py-2" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
      </label>
      <fieldset className="space-y-3 rounded border border-line/80 p-4">
        <legend className="px-1 text-sm font-medium">SEO</legend>
        <label className="block text-sm">
          seoTitle
          <input className="mt-1 w-full rounded border border-line px-3 py-2" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </label>
        <label className="block text-sm">
          seoDescription
          <textarea className="mt-1 w-full rounded border border-line px-3 py-2" rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </label>
        <label className="block text-sm">
          seoKeywords (მძიმით)
          <input className="mt-1 w-full rounded border border-line px-3 py-2" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
        </label>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">თავები</legend>
        <p className="text-xs text-fg-muted">
          აუდიოს ატვირთვა: <a href="/admin/media" className="text-brand-indigo">Media Library</a> → Copy URL.
        </p>
        {chapters.map((ch, i) => (
          <div key={i} className="flex flex-wrap gap-2 rounded border border-line/80 p-2">
            <input className="flex-1 rounded border px-2 py-1 text-sm" placeholder="სათაური" value={ch.title} onChange={(e) => {
              const next = [...chapters];
              next[i] = { ...ch, title: e.target.value };
              setChapters(next);
            }} />
            <input type="number" className="w-24 rounded border px-2 py-1 text-sm" value={ch.durationSec} onChange={(e) => {
              const next = [...chapters];
              next[i] = { ...ch, durationSec: Number(e.target.value) };
              setChapters(next);
            }} />
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              placeholder="audioUrl (MP3)"
              value={ch.audioUrl ?? ''}
              onChange={(e) => {
                const next = [...chapters];
                next[i] = { ...ch, audioUrl: e.target.value };
                setChapters(next);
              }}
            />
          </div>
        ))}
        <button type="button" className="text-sm text-brand-indigo" onClick={() => setChapters([...chapters, { title: 'თავი', durationSec: 600 }])}>
          + თავი
        </button>
      </fieldset>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="btn-primary">
        შენახვა
      </button>
    </form>
  );
}

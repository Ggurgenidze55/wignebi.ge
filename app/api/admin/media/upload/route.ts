import { cmsServerFetch, refreshTokensIfNeeded } from '@/lib/cms/bff';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const body = new FormData();
  body.append('file', file, (file as File).name ?? 'upload');

  let res = await cmsServerFetch('/admin/media/upload', { method: 'POST', body });
  if (res.status === 401) {
    const ok = await refreshTokensIfNeeded();
    if (ok) res = await cmsServerFetch('/admin/media/upload', { method: 'POST', body });
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

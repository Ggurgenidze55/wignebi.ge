import { cmsServerFetch } from '@/lib/cms/bff';
import { NextResponse } from 'next/server';

export async function GET() {
  let res = await cmsServerFetch('/admin/auth/me');
  if (res.status === 401) {
    const { refreshTokensIfNeeded } = await import('@/lib/cms/bff');
    const ok = await refreshTokensIfNeeded();
    if (ok) res = await cmsServerFetch('/admin/auth/me');
  }
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

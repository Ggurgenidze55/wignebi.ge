import { cmsServerFetch, cookieOpts, ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/cms/bff';
import { NextResponse } from 'next/server';

export async function POST() {
  await cmsServerFetch('/admin/auth/logout', { method: 'POST' });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, '', { ...cookieOpts(0), maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, '', { ...cookieOpts(0), maxAge: 0 });
  return res;
}

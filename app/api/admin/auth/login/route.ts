import {
  cmsServerFetch,
  cookieOpts,
  getCmsApiUrl,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from '@/lib/cms/bff';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${getCmsApiUrl()}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-bff-request': process.env.BFF_SECRET ?? 'dev-bff',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const data = (await res.json()) as {
    accessToken: string;
    refreshToken: string;
    user: unknown;
  };
  const response = NextResponse.json({ user: data.user });
  response.cookies.set(ACCESS_COOKIE, data.accessToken, cookieOpts(15 * 60));
  response.cookies.set(REFRESH_COOKIE, data.refreshToken, cookieOpts(7 * 24 * 60 * 60));
  return response;
}

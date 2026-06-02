import { cookies } from 'next/headers';

export const ACCESS_COOKIE = 'tsignebi_access';
export const REFRESH_COOKIE = 'tsignebi_refresh';

export function getCmsApiUrl() {
  return process.env.CMS_API_URL ?? 'http://localhost:4000/api';
}

export function cookieOpts(maxAgeSec: number) {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    maxAge: maxAgeSec,
    path: '/',
  };
}

export async function readAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function readRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function cmsServerFetch(path: string, init?: RequestInit) {
  const token = await readAccessToken();
  const url = `${getCmsApiUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const hasContentType = !!(init?.headers as Record<string, string> | undefined)?.['Content-Type'];
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.body && !hasContentType && !isFormData
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
    cache: 'no-store',
  });
}

export async function refreshTokensIfNeeded() {
  const refresh = await readRefreshToken();
  if (!refresh) return false;
  const res = await fetch(`${getCmsApiUrl()}/admin/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-bff-request': process.env.BFF_SECRET ?? 'dev-bff',
    },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, data.accessToken, cookieOpts(15 * 60));
  jar.set(REFRESH_COOKIE, data.refreshToken, cookieOpts(7 * 24 * 60 * 60));
  return true;
}

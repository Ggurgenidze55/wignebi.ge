import { CMS_REVALIDATE, getCmsApiUrl, useStaticDataOnly } from './config';

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (useStaticDataOnly()) return null;
  const base = getCmsApiUrl().replace(/\/$/, '');
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      ...init,
      next: { revalidate: CMS_REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

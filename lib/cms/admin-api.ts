/** Admin API client — uses HttpOnly cookie BFF routes; no JWT in JavaScript. */

export async function adminLogin(email: string, password: string) {
  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function adminLogout() {
  await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' });
}

export async function adminMe() {
  const res = await fetch('/api/admin/auth/me', { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const res = await fetch(`/api/admin/proxy/${clean}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function adminUpload(file: File, onProgress?: (pct: number) => void) {
  const form = new FormData();
  form.append('file', file);
  return new Promise<unknown>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/media/upload');
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
      else reject(new Error(xhr.responseText || 'Upload failed'));
    };
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(form);
  });
}

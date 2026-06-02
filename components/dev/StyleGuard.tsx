'use client';

import { useEffect, useState } from 'react';

function tailwindLoaded(): boolean {
  const hidden = document.createElement('div');
  hidden.className = 'hidden';
  hidden.style.cssText = 'position:absolute;pointer-events:none';
  document.body.appendChild(hidden);
  const ok = getComputedStyle(hidden).display === 'none';
  document.body.removeChild(hidden);

  const fg = document.createElement('span');
  fg.className = 'text-fg';
  fg.style.cssText = 'position:absolute;pointer-events:none;opacity:0';
  document.body.appendChild(fg);
  const fgOk = getComputedStyle(fg).color === 'rgb(15, 23, 42)';
  document.body.removeChild(fg);

  return ok && fgOk;
}

async function cssLinkOk(): Promise<boolean> {
  const links = Array.from(
    document.querySelectorAll('link[rel="stylesheet"][href*="_next/static"]'),
  ) as HTMLLinkElement[];
  if (!links.length) return true;
  try {
    const results = await Promise.all(
      links.slice(0, 3).map((link) => fetch(link.href, { cache: 'no-store' }).then((r) => r.ok)),
    );
    return results.every(Boolean);
  } catch {
    return false;
  }
}

/**
 * Dev-only: detects missing/broken Tailwind CSS (stale .next hash → 404) and auto-reloads.
 * Disabled in production — Vercel uses hashed CSS chunks, not layout.css.
 */
export function StyleGuard() {
  if (process.env.NODE_ENV === 'production') return null;

  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const cssOk = await cssLinkOk();
      const twOk = tailwindLoaded();

      if (cancelled) return;
      if (cssOk && twOk) {
        sessionStorage.removeItem('tsignebi-style-reload');
        return;
      }

      const key = 'tsignebi-style-reload';
      const attempts = Number(sessionStorage.getItem(key) ?? '0');
      if (attempts < 2) {
        sessionStorage.setItem(key, String(attempts + 1));
        window.location.reload();
        return;
      }

      setStuck(true);
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stuck) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(248,250,252,0.97)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '26rem',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          background: '#fff',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>სტილები არ ჩაიტვირთა</p>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
          ტერმინალში გაუშვი:
          <br />
          <code style={{ color: '#4f46e5' }}>cd ~/Desktop/audiotsignebi && npm run dev</code>
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem('tsignebi-style-reload');
            window.location.reload();
          }}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#4f46e5',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          თავიდან ცდა
        </button>
      </div>
    </div>
  );
}

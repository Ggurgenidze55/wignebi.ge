'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ka">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h1>რაღაც შეცდომა მოხდა</h1>
        <p style={{ color: '#64748B', marginTop: '0.75rem' }}>{error.message}</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '1.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#4F46E5',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          თავიდან ცდა
        </button>
      </body>
    </html>
  );
}

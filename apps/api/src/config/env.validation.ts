export function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required env: ${missing.join(', ')}`);
  }
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'dev-access-secret-change-me';
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = 'dev-refresh-secret-change-me';
  }
}

export function cookieOptions(maxAgeMs: number) {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    maxAge: maxAgeMs,
    path: '/',
  };
}

export const ACCESS_COOKIE = 'tsignebi_access';
export const REFRESH_COOKIE = 'tsignebi_refresh';
export const ACCESS_TTL_MS = 15 * 60 * 1000;
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

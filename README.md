# Tsignebi.ge — აუდიოწიგნები და ელწიგნები

## გაშვება (frontend + CMS API)

```bash
cd ~/Desktop/audiotsignebi
cp .env.example .env
# დაამატე Railway PostgreSQL DATABASE_URL

npm install
npm run db:push
npm run db:seed
npm run dev
```

- საიტი: **http://localhost:3000**
- CMS API: **http://localhost:4000/api**
- Admin: **http://localhost:3000/admin** (login → JWT)

## არქიტექტურა (CMS)

```
apps/api/              # NestJS — public + admin REST
packages/database/     # Prisma + PostgreSQL (Railway)
lib/cms/               # Next.js data layer (API + static fallback)
data/                  # სტატიკური seed / fallback (USE_STATIC_DATA=true)
app/admin/             # Admin dashboard CRUD
```

### API (NestJS)

| Public | Admin (Bearer JWT) |
|--------|-------------------|
| `GET /api/books` | `GET/POST /api/admin/books` |
| `GET /api/books/:slug` | `PATCH/DELETE /api/admin/books/:id` |
| `GET /api/authors` | `GET/POST /api/admin/authors` |
| `GET /api/genres` | `GET/POST /api/admin/genres` |
| `POST /api/admin/auth/login` | |

### Next.js env

- `CMS_API_URL` — server-side fetch (ISR `revalidate`)
- `NEXT_PUBLIC_CMS_API_URL` — admin UI
- `USE_STATIC_DATA=true` — მხოლოდ `data/*.ts` (API გარეშე)

## Railway

1. New **PostgreSQL** → copy `DATABASE_URL`
2. New **Service** from repo, root `railway.toml` (API)
3. Env: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN=https://tsignebi.ge`
4. Vercel/hosting for Next: `CMS_API_URL=https://your-api.railway.app/api`

Seed: `npm run db:seed` (admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## SEO (შენარჩუნებული)

- `GET /sitemap.xml` — CMS-დან (ან static fallback)
- JSON-LD, canonicals, `/authors`, `/genres`, `/book`, `/read`
- Admin: `robots: noindex`

## ძველი სტატიკური ფენა

`data/books.ts` (100 წიგნი), `authors.ts`, `genres.ts` — seed-ის წყარო და offline fallback.

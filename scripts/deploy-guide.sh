#!/usr/bin/env bash
# Tsignebi.ge — Deploy helper
# Usage: see README deploy section

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> 1/4 GitHub (already pushed if on main)"
git remote -v | head -1

echo ""
echo "==> 2/4 Railway — API + PostgreSQL"
echo "Run once:"
echo "  npx @railway/cli login"
echo "  npx @railway/cli init          # or: railway link"
echo "  npx @railway/cli add --plugin postgresql"
echo ""
echo "Set Railway variables (Settings → Variables):"
cat <<'ENV'
  DATABASE_URL          (from Postgres plugin)
  JWT_SECRET            (openssl rand -hex 32)
  JWT_REFRESH_SECRET    (openssl rand -hex 32)
  BFF_SECRET            (openssl rand -hex 16)
  CORS_ORIGIN           https://YOUR-VERCEL-URL.vercel.app
  NODE_ENV              production
  ADMIN_EMAIL           admin@tsignebi.ge
  ADMIN_PASSWORD        (strong password)
  R2_ENDPOINT           (optional — media uploads)
  R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY
  R2_BUCKET
  R2_PUBLIC_URL
ENV
echo ""
echo "Deploy API:"
echo "  npx @railway/cli up --service api"
echo ""
echo "After first deploy, seed DB once:"
echo "  npx @railway/cli run npm run db:seed -w @tsignebi/database"

echo ""
echo "==> 3/4 Vercel — Next.js frontend"
echo "Run once:"
echo "  npx vercel login"
echo "  npx vercel link"
echo ""
echo "Set Vercel env (Project → Settings → Environment Variables):"
cat <<'ENV'
  CMS_API_URL           https://YOUR-RAILWAY-API.up.railway.app/api
  BFF_SECRET            (same as Railway)
  JWT_SECRET            (same as Railway — for BFF if needed)
  NODE_ENV              production
ENV
echo ""
echo "Deploy frontend:"
echo "  npx vercel --prod --yes"

echo ""
echo "==> 4/4 Verify"
echo "  curl https://YOUR-RAILWAY-API.up.railway.app/api/health"
echo "  open https://YOUR-VERCEL-URL.vercel.app"
echo "  open https://YOUR-VERCEL-URL.vercel.app/admin/login"

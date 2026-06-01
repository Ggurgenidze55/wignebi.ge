import { cmsServerFetch, refreshTokensIfNeeded } from '@/lib/cms/bff';
import { NextRequest, NextResponse } from 'next/server';

async function proxy(req: NextRequest, path: string) {
  const url = `/admin/${path}${req.nextUrl.search}`;
  const init: RequestInit = {
    method: req.method,
    headers: { 'Content-Type': req.headers.get('content-type') ?? 'application/json' },
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text();
  }

  let res = await cmsServerFetch(url, init);
  if (res.status === 401) {
    const ok = await refreshTokensIfNeeded();
    if (ok) res = await cmsServerFetch(url, init);
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
  });
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path.join('/'));
}

export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path.join('/'));
}

export async function PATCH(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path.join('/'));
}

export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path.join('/'));
}

import { getCmsApiUrl, readAccessToken } from '@/lib/cms/bff';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = await readAccessToken();
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type');
  if (!contentType?.startsWith('multipart/form-data')) {
    return NextResponse.json({ message: 'Invalid upload payload' }, { status: 400 });
  }

  // Stream multipart body directly to API to avoid JSON/body-parser limits.
  const res = await fetch(`${getCmsApiUrl()}/admin/media/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType,
    },
    body: req.body,
    // Required in Node runtime when streaming request bodies.
    duplex: 'half',
  } as RequestInit & { duplex: 'half' });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

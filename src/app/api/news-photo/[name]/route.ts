import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function isSafeFileName(name: string): boolean {
  return !name.includes('/') && !name.includes('\\') && !name.includes('..');
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  if (!isSafeFileName(decodedName)) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), 'public', 'news-photos', decodedName);

  try {
    const file = await readFile(fullPath);
    const ext = path.extname(decodedName).toLowerCase();
    const contentType = CONTENT_TYPE_BY_EXT[ext] || 'application/octet-stream';

    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}

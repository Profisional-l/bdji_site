import { NextResponse } from 'next/server';

import { getPublishedNewsById } from '@/lib/newsStore';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId)) {
    return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 });
  }

  const news = await getPublishedNewsById(parsedId);

  if (!news) {
    return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 });
  }

  return NextResponse.json(news);
}

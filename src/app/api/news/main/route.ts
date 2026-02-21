import { NextResponse } from 'next/server';

import { getMainNews } from '@/lib/newsStore';

export async function GET() {
  const mainNews = await getMainNews(5);
  return NextResponse.json(mainNews);
}

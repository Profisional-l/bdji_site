import { NextResponse } from 'next/server';
import { getPublishedNews } from '@/lib/newsStore';

export async function GET() {
  const publishedNews = await getPublishedNews();

  const newsList = publishedNews.map((item) => ({
    id: item.id,
    date: item.date,
    title: item.title,
    image: item.image
      ? `/api/news-photo/${encodeURIComponent(
          Array.isArray(item.image) ? item.image[0] : item.image,
        )}`
      : '/logos/footer_logo.png',
  }));

  return NextResponse.json(newsList);
}

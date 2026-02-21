import { notFound } from 'next/navigation';
import { getPublishedNewsById } from '@/lib/newsStore';

import NewsDetailClient from '@/app/news/[id]/NewsDetailClient';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId)) {
    return notFound();
  }

  const newsItem = await getPublishedNewsById(parsedId);

  if (!newsItem) {
    return notFound();
  }

  return <NewsDetailClient newsItem={newsItem} />;
}

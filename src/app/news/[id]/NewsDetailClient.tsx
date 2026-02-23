'use client';

import Image from 'next/image';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { StoredNewsItem } from '@/lib/newsStore';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay, Pagination } from 'swiper/modules';

function renderParagraphWithLinks(paragraph: string) {
  const urlRegex = /(https?:\/\/[^\s)]+)(\)?)/g;
  const parts = paragraph.split(urlRegex);

  return parts.map((part, index) => {
    if (part && /^https?:\/\//.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 underline hover:text-blue-800'
        >
          {part}
        </a>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function NewsDetailClient({
  newsItem,
}: {
  newsItem: StoredNewsItem;
}) {
  return (
    <section>
      <Header type='bg' />
      <section className='news__page flex-center'>
        <div className='page__wrapper wrapper--my'>
          <h1 className='text-2xl font-bold mb-4'>{newsItem.title}</h1>
          <div className='text-sm text-gray-600 mb-6'>{newsItem.date}</div>

          <div className='flex flex-col gap-8'>
            <div className='relative'>
              {newsItem.image &&
                (Array.isArray(newsItem.image) ? (
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    pagination={{
                      clickable: true,
                    }}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    className='aspect-video max-h-[600px]'
                  >
                    {newsItem.image.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className='relative aspect-video'>
                          <Image
                            src={`/news-photos/${img}`}
                            alt={`${newsItem.title} - изображение ${index + 1}`}
                            fill
                            className='object-cover'
                            unoptimized
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className='relative aspect-video'>
                    <Image
                      src={`/news-photos/${newsItem.image}`}
                      alt={newsItem.title}
                      fill
                      className='object-cover'
                      unoptimized
                    />
                  </div>
                ))}
            </div>

            <div className='space-y-4'>
              {newsItem.text.map((paragraph, index) =>
                typeof paragraph === 'string' ? (
                  <p key={index}>{renderParagraphWithLinks(paragraph)}</p>
                ) : (
                  <p key={index}>
                    <a
                      href={paragraph.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline hover:text-blue-800'
                    >
                      {paragraph.text}
                    </a>
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </section>
  );
}

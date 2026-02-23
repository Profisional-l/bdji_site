import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  news: {
    id: number;
    date: string;
    title: string;
    image: string;
  };
}

const FeedCard = ({ news }: NewsCardProps) => {
  return (
    <div className={`news-item item-${news.id}`}>
      <Link
        href={`/news/${news.id}`}
        className='flex flex-col gap-[15px] border-[2px] rounded-lg overflow-hidden 
                transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-blue'
      >
        <Image
          className='news-item__image w-full object-cover h-[500px] transition-transform duration-300 hover:scale-105'
          src={news.image}
          width={400}
          height={400}
          alt={news.title}
          unoptimized
        />
        <div className={`news-item__text text-item-${news.id} p-4`}>
          <h2 className='font-semibold text-[20px] text-blue'>{news.date}</h2>
          <p>{news.title}</p>
        </div>
      </Link>
    </div>
  );
};

export default FeedCard;

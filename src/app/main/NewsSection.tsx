import Image from 'next/image';
import DalianTrip from '../../../public/news-photos/dalian_trip.png';
import { getMainNews } from '@/lib/newsStore';
import Link from 'next/link';

const NewsSection = async () => {
  const mainNews = await getMainNews(5);

  return (
    <section className='news flex-center'>
      <div className='news__wrapper wrapper--my'>
        <h2 className='flex flex-col'>
          <span className='text-red text-[56px]'>新闻</span>
          <span className='wwtitle--bold ml-[10px]'>Новости</span>
        </h2>
        <div className='news__content mt-[25px] lg:mt-[50px] flex max-lg:flex-col max-lg:gap-[25px] gap-[40px]'>
          <div className='news__banner'>
            <Image
              src={DalianTrip}
              className='lg:min-w-[500px]'
              alt='Белорусские студенты на экскурсии, организованной ДПУ'
            />
          </div>

          <div className='news__list flex flex-col justify-center'>
            {mainNews.map((news, index) => (
              <div key={index}>
                <div className='flex justify-between items-center text-left gap-[30px]'>
                  <Link
                    href={news.href}
                    className='news__item hover:text-red transition-colors'
                  >
                    {news.title}
                  </Link>
                  <div className='flex flex-col text-[18px] text-red justify-end'>
                    <span>{news.date.split('.').slice(0, 2).join('.')}</span>
                    <span>{news.date.split('.')[2]}</span>
                  </div>
                </div>
                {index !== mainNews.length - 1 && <hr className='my-[15px]' />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

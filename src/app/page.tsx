import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import OurHistory from './main/OurHistory';
import HeaderWrapper from './main/HeaderWrapper';
import Advantages from './main/Advantages';
import NewsSection from './main/NewsSection';

import FadeIn from '@/ui/FadeIn';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className=''>
      <HeaderWrapper>
        <Header type='none' />
      </HeaderWrapper>
      <FadeIn>
        <OurHistory />
      </FadeIn>
      <FadeIn>
        <Advantages />
      </FadeIn>
      <FadeIn>
        <NewsSection />
      </FadeIn>
      <Footer />
    </div>
  );
}

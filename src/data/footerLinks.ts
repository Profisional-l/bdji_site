import { FooterLink } from '@/types/footerLink';

export const footerLinks: FooterLink = {
  fCol: [
    {
      name: 'Об институте',
      href: '/about-institute',
    },
    {
      name: 'Новости',
      href: '/news',
    },
    {
      name: 'План приёма',
      href: '/admission-plan',
    },
  ],

  sCol: {
    headline: 'БГУ',
    links: [
      {
        name: 'Сайт БГУ',
        href: 'https://bsu.by/',
      },
      {
        name: 'Личный кабинет студента',
        href: 'https://student.bsu.by/',
      },
      {
        name: 'Электронная библиотека',
        href: 'https://elib.bsu.by/',
      },
      {
        name: 'Министерство образования',
        href: 'https://edu.gov.by/',
      },
      {
        name: 'Политика Cookies',
        href: 'https://abiturient.bsu.by/cookie-info/',
      },
    ],
  },

  tCol: {
    headline: 'Контакты',
    p: '+375 (17) 209-53-73',
    // allLinks: [
    //     {
    //         name: 'Как добраться',
    //         href: '',
    //         bold: true,
    //     },
    //     {
    //         name: 'Мерч',
    //         href: '',
    //         bold: true,
    //     }
    // ]
  },
};

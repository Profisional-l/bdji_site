import { HeaderLink } from '@/types/headerLink';

export const headerLinks: HeaderLink[] = [
  {
    name: 'Институт',
    submenu: [
      {
        subname: 'Об институте',
        subhref: '/about-institute',
      },
      {
        subname: 'Мы и Далянь',
        subhref: '/us-and-dalian',
      },
      {
        subname: 'РИКК',
        subhref: '/rikk',
      },
      {
        subname: 'Контакты',
        subhref: '/contacts',
      },
      {
        subname: 'Нормативные документы',
        subhref: '/docs',
      },
      {
        subname: 'Мы в СМИ',
        subhref: '/we-in-the-media',
      },
      {
        subname: 'Идеологическая и воспит. работа↗',
        subhref: 'https://minsk.gov.by/ru/actual/view/209/2026.shtml',
        blank: true,
      },
    ],
  },

  {
    name: 'Новости',
    href: '/news',
  },

  {
    name: 'Абитуриентам',
    submenu: [
      {
        subname: 'Специальности',
        subhref: '/specialities',
      },
      // {
      //   subname: 'Проходные баллы',
      //   subhref: '/passing-grades',
      // },
      {
        subname: 'План приёма',
        subhref: '/admission-plan',
      },
      {
        subname: 'Подача документов',
        subhref: '/filing-of-documents',
      },
    ],
  },

  {
    name: 'Студентам',
    submenu: [
      {
        subname: 'График учебного процесса',
        subhref: '/schedule',
      },
      {
        subname: 'Общежитие',
        subhref: '/dorm',
      },
      {
        subname: 'Наука ↗',
        subhref: 'https://conf.bsu.by/',
        blank: true,
      },
      {
        subname: 'Академические обмены ↗',
        subhref: 'https://ums.bsu.by/ru/mezhvuzovskoe-sotrudnichestvo',
        blank: true,
      },
      {
        subname: 'Студенческие организации ↗',
        subhref:
          'https://bsu.by/studentam/vneuchebnaya-deyatelnost/studencheskie-organizatsii/',
        blank: true,
      },
      {
        subname: 'Летние и зимние школы',
        subhref: '/summer-and-winter-schools',
      },
      {
        subname: 'Студсовет СИБД',
        subhref: '/sibd_active',
      }
    ],
  },
];

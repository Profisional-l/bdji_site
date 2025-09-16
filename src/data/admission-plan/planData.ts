import mmfLogo from '@/../public/logos/mmfLogo.svg';
import physLogo from '@/../public/logos/physLogo.svg';
import fmoLogo from '@/../public/logos/fmoLogo.svg';

const dataSourcePhyz = [
  {
    key: '1',
    title: 'План приема',
    budget2022: '20',
    paid2022: '5',
    budget2023: '20',
    paid2023: '5',
    budget2024: '20',
    paid2024: '5',
    budget2025: '20',
    paid2025: '5',
  },
  {
    key: '2',
    title: 'Проходные баллы',
    budget2022: '303',
    paid2022: '257',
    budget2023: '325',
    paid2023: '254',
    budget2024: '343',
    paid2024: '287',
    budget2025: '371',
    paid2025: '302',
  },
];

const dataSourceMath = [
  {
    key: '1',
    title: 'План приема',
    budget2022: '20',
    paid2022: '5',
    budget2023: '20',
    paid2023: '5',
    budget2024: '20',
    paid2024: '5',
    budget2025: '20',
    paid2025: '5',
  },
  {
    key: '2',
    title: 'Проходные баллы',
    budget2022: '296',
    paid2022: '263',
    budget2023: '347',
    paid2023: '285',
    budget2024: '356',
    paid2024: '295',
    budget2025: '367',
    paid2025: '317',
  },
];

const dataSource = [
  {
    key: '1',
    title: 'План приема',
    budget2022: '-',
    paid2022: '20',
    budget2023: '-',
    paid2023: '20',
    budget2024: '-',
    paid2024: '20',
    budget2025: '-',
    paid2025: '20',
  },
  {
    key: '2',
    title: 'Проходные баллы',
    budget2022: '-',
    paid2022: '264',
    budget2023: '-',
    paid2023: '301',
    budget2024: '-',
    paid2024: '334',
    budget2025: '-',
    paid2025: '353',
  },
];

export const columns = [
  {
    title: 'Форма обучения',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '2022',
    children: [
      {
        title: 'Бюджет',
        dataIndex: 'budget2022',
        key: 'budget2022',
        align: 'center',
      },
      {
        title: 'Платная',
        dataIndex: 'paid2022',
        key: 'paid2022',
        align: 'center',
      },
    ],
  },
  {
    title: '2023',
    children: [
      {
        title: 'Бюджет',
        dataIndex: 'budget2023',
        key: 'budget2023',
        align: 'center',
      },
      {
        title: 'Платная',
        dataIndex: 'paid2023',
        key: 'paid2023',
        align: 'center',
      },
    ],
  },
  {
    title: '2024',
    children: [
      {
        title: 'Бюджет',
        dataIndex: 'budget2024',
        key: 'budget2024',
        align: 'center',
      },
      {
        title: 'Платная',
        dataIndex: 'paid2024',
        key: 'paid2024',
        align: 'center',
      },
    ],
  },
  {
    title: '2025',
    children: [
      {
        title: 'Бюджет',
        dataIndex: 'budget2025',
        key: 'budget2025',
        align: 'center',
      },
      {
        title: 'Платная',
        dataIndex: 'paid2025',
        key: 'paid2025',
        align: 'center',
      },
    ],
  },
];

export const specialities = [
  {
    id: 'phys',
    name: 'Прикладная физика',
    logo: physLogo,
    data: dataSourcePhyz,
  },
  {
    id: 'math',
    name: 'Механика и математическое моделирование',
    logo: mmfLogo,
    data: dataSourceMath,
  },
  {
    id: 'economy',
    name: 'Мировая экономика',
    logo: fmoLogo,
    data: dataSource,
  },
];

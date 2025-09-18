// Определяем тип для текста или ссылки
type NewsTextBlock =
  | string
  | {
      type: 'link';
      text: string;
      url: string;
    };

export type NewsDataProps = {
  id: number;
  title: string;
  text: NewsTextBlock[];
  image?: string | string[];
  date: string;
};

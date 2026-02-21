# BDJI Site

Website of the Joint Institute of BSU and DUT: http://bdji.bsu.by

## Новости: автоматизация через Telegram-бота

Реализован режим, в котором новости берутся из JSON-файла `data/news/news.json`, а управляются через Telegram-бота.

- Сайт показывает только `published` новости.
- Для главной страницы используется флаг `showOnMain`.
- Бот сохраняет фото в `public/news-photos`, а записи — в `data/news/news.json`.

## Что уже реализовано

- JSON-хранилище новостей: `data/news/news.json`
- Публичные API:
  - `GET /api/news` — лента опубликованных новостей
  - `GET /api/news/:id` — конкретная опубликованная новость
  - `GET /api/news/main` — новости для главной (`showOnMain=true`)
- Telegram-бот (long polling): `scripts/telegram-news-bot.cjs`
- Docker-сервисы:
  - `app` — Next.js
  - `bot` — Telegram-бот
  - `nginx` — reverse proxy + SSL

## 1) Локальный запуск (без Docker)

### Требования

- Node.js 18+
- npm 9+

### Шаги

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env.local` на основе `.env.example`:

```bash
TG_BOT_TOKEN=ваш_токен_бота
TG_ALLOWED_USER_IDS=123456789
```

3. Запустить сайт:

```bash
npm run dev
```

4. В отдельном терминале запустить бота:

```bash
npm run bot:news
```

Сайт: `http://localhost:3000`

## 2) Локальный запуск в Docker

1. Создать файл `.env` в корне проекта:

```bash
TG_BOT_TOKEN=ваш_токен_бота
TG_ALLOWED_USER_IDS=123456789
```

2. Поднять сервисы:

```bash
docker-compose up -d --build
```

3. Проверить:

```bash
docker-compose ps
docker-compose logs -f app
docker-compose logs -f bot
```

4. Остановить:

```bash
docker-compose down
```

## 3) Деплой на сервер (как у вас)

У вас уже есть скрипт `deploy.sh`, который всё поднимает через Docker.

### Перед первым деплоем

1. Убедиться, что в корне проекта на сервере есть `.env`:

```bash
TG_BOT_TOKEN=ваш_токен_бота
TG_ALLOWED_USER_IDS=123456789,987654321
```

2. Запустить деплой:

```bash
bash deploy.sh
```

Скрипт проверит наличие `.env` и обязательных переменных бота.

### Полезные команды после деплоя

```bash
docker-compose ps
docker-compose logs -f bot
docker-compose logs -f app
docker-compose restart bot
```

## 4) Как публиковать новости через Telegram

1. Перешлите пост (текст/фото) боту.
2. Бот создаст `draft` и вернёт ID.
3. Опубликуйте:

```text
/publish <id>
```

4. Вывести на главную:

```text
/main_on <id>
```

## Команды Telegram-бота

- Просто отправьте или перешлите пост с текстом/фото — создастся `draft`.
- Основное управление (публикация, на главную, удаление, редактирование) — через inline-кнопки в боте.
- Доступные slash-команды:
  - `/start`, `/help`, `/menu`
  - `/list [all|published|draft|deleted|main]`
  - `/show <id>`
  - `/search <текст>`
  - `/stats`

## 5) Получение Telegram user id редакторов

- Напишите боту `@userinfobot` (или аналогу) и получите числовой `id`.
- Добавьте `id` в `TG_ALLOWED_USER_IDS` через запятую.
- Перезапустите бота:

```bash
docker-compose restart bot
```

## Важно для серверов во внутренней сети

- Бот работает в режиме `long polling`, поэтому внешний webhook не нужен.
- Достаточно исходящего доступа сервера к `api.telegram.org`.
- Деплой для публикации новостей не требуется: сайт читает JSON при запросах API.

## Типовые проблемы

- Бот не стартует: проверьте `TG_BOT_TOKEN` и `TG_ALLOWED_USER_IDS`.
- Новости не видны на сайте: проверьте, что у записи `status=published`.
- Новость не на главной: выполните `/main_on <id>`.
- Фото не отображается: проверьте, что файл есть в `public/news-photos` (в volume `news-photos`).

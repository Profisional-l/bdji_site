import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { MainPageNewsType } from '@/types/mainPageNews';
import { NewsDataProps } from '@/types/newsProps';

export type NewsStatus = 'draft' | 'published' | 'deleted';

export type StoredNewsItem = NewsDataProps & {
  status: NewsStatus;
  showOnMain: boolean;
  createdAt: string;
  updatedAt: string;
};

type NewsStore = {
  version: 1;
  seededFromLegacy: boolean;
  lastId: number;
  items: StoredNewsItem[];
};

const NEWS_DIR = path.join(process.cwd(), 'data', 'news');
const NEWS_FILE_PATH = path.join(NEWS_DIR, 'news.json');

function getNowIso(): string {
  return new Date().toISOString();
}

function parseMainHrefId(href: string): number | null {
  const match = href.match(/\/news\/(\d+)/);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}

async function ensureDir(): Promise<void> {
  await mkdir(NEWS_DIR, { recursive: true });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeStoreAtomic(store: NewsStore): Promise<void> {
  await ensureDir();
  const tmpPath = `${NEWS_FILE_PATH}.tmp`;
  await writeFile(tmpPath, JSON.stringify(store, null, 2), 'utf-8');
  await rename(tmpPath, NEWS_FILE_PATH);
}

async function seedFromLegacy(): Promise<NewsStore> {
  const [{ default: legacyNews }, { default: mainNews }] = await Promise.all([
    import('@/data/news/newsData'),
    import('@/data/main/mainNews'),
  ]);

  const mainIds = new Set<number>();
  for (const item of mainNews as MainPageNewsType[]) {
    const parsedId = parseMainHrefId(item.href);
    if (parsedId !== null) {
      mainIds.add(parsedId);
    }
  }

  const now = getNowIso();
  const items: StoredNewsItem[] = (legacyNews as NewsDataProps[]).map((item) => ({
    ...item,
    status: 'published',
    showOnMain: mainIds.has(item.id),
    createdAt: now,
    updatedAt: now,
  }));

  const store: NewsStore = {
    version: 1,
    seededFromLegacy: true,
    lastId: items.reduce((maxId, item) => Math.max(maxId, item.id), 0),
    items,
  };

  await writeStoreAtomic(store);
  return store;
}

async function getTemplateStore(): Promise<NewsStore> {
  return {
    version: 1,
    seededFromLegacy: false,
    lastId: 0,
    items: [],
  };
}

export async function readStore(): Promise<NewsStore> {
  const exists = await fileExists(NEWS_FILE_PATH);
  if (!exists) {
    return seedFromLegacy();
  }

  try {
    const raw = await readFile(NEWS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<NewsStore>;

    if (!Array.isArray(parsed.items)) {
      throw new Error('Invalid store file');
    }

    const normalized: NewsStore = {
      version: 1,
      seededFromLegacy: Boolean(parsed.seededFromLegacy),
      lastId:
        typeof parsed.lastId === 'number'
          ? parsed.lastId
          : parsed.items.reduce((maxId, item) => Math.max(maxId, item.id), 0),
      items: parsed.items as StoredNewsItem[],
    };

    if (!normalized.seededFromLegacy && normalized.items.length === 0) {
      return seedFromLegacy();
    }

    return normalized;
  } catch {
    const template = await getTemplateStore();
    await writeStoreAtomic(template);
    return seedFromLegacy();
  }
}

export async function updateStore(
  updater: (store: NewsStore) => NewsStore,
): Promise<NewsStore> {
  const current = await readStore();
  const next = updater(current);
  await writeStoreAtomic(next);
  return next;
}

function sortByLatest(items: StoredNewsItem[]): StoredNewsItem[] {
  return [...items].sort((a, b) => b.id - a.id);
}

export async function getPublishedNews(): Promise<StoredNewsItem[]> {
  const store = await readStore();
  return sortByLatest(store.items.filter((item) => item.status === 'published'));
}

export async function getPublishedNewsById(
  id: number,
): Promise<StoredNewsItem | null> {
  const store = await readStore();
  const found = store.items.find((item) => item.id === id);
  if (!found || found.status !== 'published') {
    return null;
  }
  return found;
}

export async function getMainNews(limit = 5): Promise<MainPageNewsType[]> {
  const published = await getPublishedNews();

  return published
    .filter((item) => item.showOnMain)
    .slice(0, limit)
    .map((item) => ({
      title: item.title,
      date: item.date,
      href: `/news/${item.id}`,
    }));
}

export async function initStoreIfNeeded(): Promise<void> {
  await readStore();
}
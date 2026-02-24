/* eslint-disable no-console */
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

// ==================== КОНФИГУРАЦИЯ ====================
const CONFIG = {
  // Цвета для логирования
  colors: {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  },
  // Эмодзи для интерфейса
  emoji: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    edit: '✏️',
    delete: '🗑',
    save: '💾',
    publish: '📢',
    draft: '📝',
    main: '🏠',
    image: '🖼',
    text: '📄',
    date: '📅',
    back: '🔙',
    next: '➡️',
    prev: '⬅️',
    search: '🔍',
    list: '📋',
    help: '❓',
    settings: '⚙️',
  },
  // Настройки пагинации
  pagination: {
    itemsPerPage: 5,
    maxButtonsPerRow: 3,
  },
  // Режимы редактирования
  editModes: {
    TITLE: 'title',
    TEXT: 'text',
    DATE: 'date',
    IMAGES: 'images',
    MAIN: 'main',
  },
};

// ==================== УТИЛИТЫ ====================
const logger = {
  _getTimestamp() {
    return new Date().toISOString();
  },

  _colorize(text, color) {
    return `${CONFIG.colors[color] || ''}${text}${CONFIG.colors.reset}`;
  },

  info(...args) {
    console.log(
      this._colorize(`[${this._getTimestamp()}] ℹ️ INFO:`, 'blue'),
      ...args
    );
  },

  success(...args) {
    console.log(
      this._colorize(`[${this._getTimestamp()}] ✅ SUCCESS:`, 'green'),
      ...args
    );
  },

  warn(...args) {
    console.log(
      this._colorize(`[${this._getTimestamp()}] ⚠️ WARN:`, 'yellow'),
      ...args
    );
  },

  error(...args) {
    console.error(
      this._colorize(`[${this._getTimestamp()}] ❌ ERROR:`, 'red'),
      ...args
    );
  },

  debug(...args) {
    if (process.env.DEBUG) {
      console.log(
        this._colorize(`[${this._getTimestamp()}] 🔍 DEBUG:`, 'magenta'),
        ...args
      );
    }
  },
};

// ==================== РАБОТА С ENV ====================
function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) return null;

  const key = trimmed.slice(0, eqIndex).trim();
  if (!key) return null;

  let value = trimmed.slice(eqIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

async function loadEnvFile(filePath, externalKeys) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;

      if (externalKeys.has(parsed.key)) {
        continue;
      }

      process.env[parsed.key] = parsed.value;
    }
    logger.debug(`Loaded env file: ${filePath}`);
  } catch {
    // optional file
  }
}

async function loadLocalEnvFiles() {
  const externalKeys = new Set(
    Object.keys(process.env).filter((key) => process.env[key] !== undefined)
  );

  await loadEnvFile(path.join(process.cwd(), '.env'), externalKeys);
  await loadEnvFile(path.join(process.cwd(), '.env.local'), externalKeys);
  logger.info('Environment loaded');
}

// ==================== ИНИЦИАЛИЗАЦИЯ КОНФИГУРАЦИИ ====================
function initializeConfig() {
  const BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const ALLOWED_USER_IDS = (process.env.TG_ALLOWED_USER_IDS || '')
    .split(',')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value));

  const NEWS_STORE_PATH = process.env.NEWS_STORE_PATH
    ? path.resolve(process.env.NEWS_STORE_PATH)
    : path.join(process.cwd(), 'data', 'news', 'news.json');

  const NEWS_PHOTOS_DIR = process.env.NEWS_PHOTOS_DIR
    ? path.resolve(process.env.NEWS_PHOTOS_DIR)
    : path.join(process.cwd(), 'public', 'news-photos');

  const NEWS_BACKUP_DIR = process.env.NEWS_BACKUP_DIR
    ? path.resolve(process.env.NEWS_BACKUP_DIR)
    : path.join(process.cwd(), 'data', 'news', 'backups');

  const BOT_LOCK_PATH = process.env.TG_BOT_LOCK_PATH
    ? path.resolve(process.env.TG_BOT_LOCK_PATH)
    : path.join(process.cwd(), 'data', 'news', 'telegram-bot.lock');

  const POLLING_TIMEOUT_SECONDS = Number.parseInt(
    process.env.TG_POLLING_TIMEOUT || '50',
    10
  );

  const MAX_BACKUPS = Number.parseInt(process.env.TG_MAX_BACKUPS || '10', 10);
  const BACKUP_MIN_INTERVAL_SECONDS = Number.parseInt(
    process.env.TG_BACKUP_MIN_INTERVAL_SECONDS || '600',
    10
  );

  const DROP_PENDING_UPDATES =
    (process.env.TG_DROP_PENDING_UPDATES || 'true').toLowerCase() === 'true';

  const RATE_LIMIT_MAX_RETRIES = Number.parseInt(
    process.env.TG_RATE_LIMIT_MAX_RETRIES || '3',
    10
  );

  if (!BOT_TOKEN) {
    logger.error('TG_BOT_TOKEN не задан');
    process.exit(1);
  }

  if (ALLOWED_USER_IDS.length === 0) {
    logger.error('TG_ALLOWED_USER_IDS не заданы');
    process.exit(1);
  }

  return {
    BOT_TOKEN,
    ALLOWED_USER_IDS,
    NEWS_STORE_PATH,
    NEWS_PHOTOS_DIR,
    NEWS_BACKUP_DIR,
    BOT_LOCK_PATH,
    POLLING_TIMEOUT_SECONDS,
    MAX_BACKUPS,
    BACKUP_MIN_INTERVAL_SECONDS,
    DROP_PENDING_UPDATES,
    RATE_LIMIT_MAX_RETRIES,
  };
}

// ==================== РАБОТА С ФАЙЛАМИ ====================
async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function createBackup(storePath, backupDir, maxBackups = 10) {
  try {
    await ensureDir(backupDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `news-backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupName);

    const data = await fs.readFile(storePath, 'utf-8');
    await fs.writeFile(backupPath, data, 'utf-8');

    // Очистка старых бэкапов
    const files = await fs.readdir(backupDir);
    const backupFiles = files
      .filter((f) => f.startsWith('news-backup-'))
      .map((f) => ({
        name: f,
        path: path.join(backupDir, f),
        time: f.match(/news-backup-(.+)\.json/)?.[1] || '',
      }))
      .sort((a, b) => b.time.localeCompare(a.time));

    for (let i = maxBackups; i < backupFiles.length; i++) {
      await fs.unlink(backupFiles[i].path);
      logger.debug(`Removed old backup: ${backupFiles[i].name}`);
    }

    logger.success(`Backup created: ${backupName}`);
    return backupPath;
  } catch (error) {
    logger.warn('Failed to create backup:', error.message);
    return null;
  }
}

// ==================== ОСНОВНОЕ ХРАНИЛИЩЕ ====================
class NewsStore {
  constructor(config) {
    this.config = config;
    this.cache = null;
    this.lastRead = 0;
    this.cacheTtl = 5000; // 5 секунд
    this.lastBackupAt = 0;
    this.backupMinIntervalMs =
      (this.config.BACKUP_MIN_INTERVAL_SECONDS || 600) * 1000;
  }

  async fileExists(filePath) {
    try {
      await fs.stat(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async ensureExists() {
    await ensureDir(path.dirname(this.config.NEWS_STORE_PATH));

    try {
      await fs.stat(this.config.NEWS_STORE_PATH);
    } catch {
      const template = {
        version: 2,
        seededFromLegacy: false,
        lastId: 0,
        items: [],
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      await this.write(template);
      logger.info('Created new news store');
    }
  }

  async read(force = false) {
    const now = Date.now();
    if (!force && this.cache && now - this.lastRead < this.cacheTtl) {
      return this.cache;
    }

    await this.ensureExists();
    const raw = await fs.readFile(this.config.NEWS_STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.items)) {
      throw new Error('Некорректный формат store-файла');
    }

    // Валидация и миграция данных
    parsed.items = parsed.items.map((item) => this.validateItem(item));

    if (typeof parsed.lastId !== 'number') {
      parsed.lastId = parsed.items.reduce(
        (maxId, item) => Math.max(maxId, Number(item.id) || 0),
        0
      );
    }

    this.cache = parsed;
    this.lastRead = now;

    return parsed;
  }

  validateItem(item) {
    // Убеждаемся, что все поля в правильном формате
    return {
      id: item.id || 0,
      title: item.title || 'Без заголовка',
      text: Array.isArray(item.text) ? item.text : [item.text || ''],
      image: item.image || undefined,
      date: item.date || this.todayDate(),
      status: item.status || 'draft',
      showOnMain: item.showOnMain || false,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      source: item.source || null,
      metadata: item.metadata || {},
    };
  }

  async write(store) {
    store.metadata = store.metadata || {};
    store.metadata.updatedAt = new Date().toISOString();

    const now = Date.now();
    const shouldCreateBackup =
      now - this.lastBackupAt >= this.backupMinIntervalMs;

    if (
      shouldCreateBackup &&
      (await this.fileExists(this.config.NEWS_STORE_PATH))
    ) {
      await createBackup(
        this.config.NEWS_STORE_PATH,
        this.config.NEWS_BACKUP_DIR,
        this.config.MAX_BACKUPS
      );
      this.lastBackupAt = now;
    }

    const tmpPath = `${this.config.NEWS_STORE_PATH}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(store, null, 2), 'utf-8');
    await fs.rename(tmpPath, this.config.NEWS_STORE_PATH);

    this.cache = store;
    this.lastRead = Date.now();

    logger.debug('Store updated');
  }

  async findById(id) {
    const store = await this.read();
    return store.items.find((item) => item.id === id);
  }

  async findIndex(id) {
    const store = await this.read();
    return store.items.findIndex((item) => item.id === id);
  }

  async update(id, updater) {
    const store = await this.read();
    const index = store.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    const current = store.items[index];
    const updated = {
      ...current,
      ...updater(current),
      updatedAt: new Date().toISOString(),
    };

    store.items[index] = this.validateItem(updated);
    await this.write(store);

    return store.items[index];
  }

  async create(itemData) {
    const store = await this.read();

    const id = store.lastId + 1;
    const now = new Date().toISOString();

    const newItem = this.validateItem({
      id,
      ...itemData,
      createdAt: now,
      updatedAt: now,
    });

    store.lastId = id;
    store.items.unshift(newItem);

    await this.write(store);

    return newItem;
  }

  async delete(id) {
    return this.update(id, () => ({
      status: 'deleted',
      showOnMain: false,
    }));
  }

  async restore(id) {
    return this.update(id, () => ({ status: 'draft' }));
  }

  async publish(id) {
    return this.update(id, () => ({ status: 'published' }));
  }

  async unpublish(id) {
    return this.update(id, () => ({ status: 'draft' }));
  }

  async setMain(id, value) {
    return this.update(id, () => ({ showOnMain: value }));
  }

  async list(filter = 'all', page = 1, perPage = 10) {
    const store = await this.read();

    let filtered = store.items;
    if (filter === 'main') {
      filtered = filtered.filter(
        (item) => item.showOnMain && item.status === 'published'
      );
    } else if (filter !== 'all') {
      filtered = filtered.filter((item) => item.status === filter);
    }

    const total = filtered.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const items = filtered.slice(start, end);

    return {
      items,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async search(query, filter = 'all') {
    const store = await this.read();
    const searchLower = query.toLowerCase();

    let items = store.items;
    if (filter !== 'all') {
      items = items.filter((item) => item.status === filter);
    }

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.text.some((block) => block.toLowerCase().includes(searchLower))
    );
  }

  todayDate() {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return formatter.format(new Date());
  }

  formatNewsShort(item) {
    const mainIcon = item.showOnMain ? CONFIG.emoji.main : '';
    const statusIcon =
      {
        published: CONFIG.emoji.publish,
        draft: CONFIG.emoji.draft,
        deleted: CONFIG.emoji.delete,
      }[item.status] || '';

    return `${CONFIG.emoji.list} *#${item.id}* ${statusIcon}${mainIcon} ${item.date}\n${item.title}`;
  }

  formatNewsFull(item) {
    const parts = [
      `${CONFIG.emoji.list} *НОВОСТЬ #${item.id}*`,
      '',
      `*📌 Заголовок:* ${item.title}`,
      `*📅 Дата:* ${item.date}`,
      `*📊 Статус:* ${item.status}`,
      `*🏠 На главной:* ${item.showOnMain ? 'Да' : 'Нет'}`,
      `*🖼 Изображений:* ${Array.isArray(item.image) ? item.image.length : item.image ? 1 : 0}`,
      `*📝 Абзацев:* ${item.text.length}`,
      '',
      '*Текст:*',
      ...item.text.map((block, i) => `${i + 1}. ${block}`),
    ];

    if (item.source) {
      parts.push('', '*Источник:* Telegram');
    }

    return parts.join('\n');
  }
}

// ==================== TELEGRAM API ====================
class TelegramAPI {
  constructor(token, options = {}) {
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${token}`;
    this.rateLimitMaxRetries = options.rateLimitMaxRetries || 3;
  }

  async call(method, params = {}, method_type = 'GET', attempt = 0) {
    const url = `${this.baseUrl}/${method}`;

    try {
      let response;

      if (method_type === 'POST') {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
      } else {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          if (typeof value === 'object') {
            query.set(key, JSON.stringify(value));
          } else {
            query.set(key, String(value));
          }
        });

        const fullUrl = query.toString() ? `${url}?${query.toString()}` : url;
        response = await fetch(fullUrl);
      }

      const data = await response.json();

      if (!data.ok) {
        const description =
          data.description || `Ошибка Telegram API (${method})`;

        if (
          method === 'editMessageText' &&
          description.includes('message is not modified')
        ) {
          logger.debug(`Telegram API noop (${method}): ${description}`);
          return null;
        }

        if (
          method === 'answerCallbackQuery' &&
          (description.includes('query is too old') ||
            description.includes('query ID is invalid'))
        ) {
          logger.warn(`Callback answer skipped (${method}): ${description}`);
          return null;
        }

        if (description.includes('Too Many Requests')) {
          const fromParams = Number(data?.parameters?.retry_after || 0);
          const fromTextMatch = description.match(/retry after\s+(\d+)/i);
          const fromText = fromTextMatch
            ? Number.parseInt(fromTextMatch[1], 10)
            : 0;
          const retryAfterSeconds = fromParams || fromText || 3;

          if (attempt < this.rateLimitMaxRetries) {
            logger.warn(
              `Rate limit on ${method}, waiting ${retryAfterSeconds}s (retry ${attempt + 1}/${this.rateLimitMaxRetries})`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, retryAfterSeconds * 1000)
            );
            return this.call(method, params, method_type, attempt + 1);
          }
        }

        throw new Error(description);
      }

      return data.result;
    } catch (error) {
      logger.error(`Telegram API error (${method}):`, error.message);
      throw error;
    }
  }

  async sendMessage(chatId, text, options = {}) {
    return this.call(
      'sendMessage',
      {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        ...options,
      },
      'POST'
    );
  }

  async editMessageText(chatId, messageId, text, options = {}) {
    return this.call(
      'editMessageText',
      {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'Markdown',
        ...options,
      },
      'POST'
    );
  }

  async sendPhoto(chatId, photo, caption = '', options = {}) {
    // Для простоты используем URL или file_id
    return this.call(
      'sendPhoto',
      {
        chat_id: chatId,
        photo,
        caption,
        parse_mode: 'Markdown',
        ...options,
      },
      'POST'
    );
  }

  async deleteMessage(chatId, messageId) {
    return this.call(
      'deleteMessage',
      {
        chat_id: chatId,
        message_id: messageId,
      },
      'POST'
    );
  }

  async answerCallbackQuery(callbackQueryId, text = null, showAlert = false) {
    return this.call(
      'answerCallbackQuery',
      {
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      },
      'POST'
    );
  }

  async getFile(fileId) {
    return this.call('getFile', { file_id: fileId });
  }

  async downloadFile(filePath) {
    const url = `https://api.telegram.org/file/bot${this.token}/${filePath}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка скачивания файла: ${response.status}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  createInlineKeyboard(buttons) {
    return {
      inline_keyboard: buttons,
    };
  }
}

// ==================== ОБРАБОТЧИК КОМАНД ====================
class CommandHandler {
  constructor(telegram, store, config) {
    this.telegram = telegram;
    this.store = store;
    this.config = config;
    this.itemsPerPage =
      config?.pagination?.itemsPerPage ?? CONFIG.pagination.itemsPerPage;
    this.userSessions = new Map(); // Для хранения временных данных пользователей
    this.editSessions = new Map(); // Для режима редактирования
  }

  // Проверка доступа
  isAllowed(userId) {
    return this.config.ALLOWED_USER_IDS.includes(userId);
  }

  // Получение или создание сессии пользователя
  getUserSession(userId) {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, {
        currentPage: 1,
        currentFilter: 'all',
        lastMessageId: null,
        lastCommand: null,
      });
    }
    return this.userSessions.get(userId);
  }

  // Получение сессии редактирования
  getEditSession(userId, newsId) {
    const key = `${userId}:${newsId}`;
    if (!this.editSessions.has(key)) {
      this.editSessions.set(key, {
        mode: null,
        newsId,
        tempData: {},
        messageId: null,
      });
    }
    return this.editSessions.get(key);
  }

  // Очистка сессии редактирования
  clearEditSession(userId, newsId) {
    const key = `${userId}:${newsId}`;
    this.editSessions.delete(key);
  }

  // ==================== КЛАВИАТУРЫ ====================

  // Главное меню
  getMainMenu() {
    return this.telegram.createInlineKeyboard([
      [
        {
          text: `${CONFIG.emoji.list} Список новостей`,
          callback_data: 'menu_list',
        },
        { text: `${CONFIG.emoji.search} Поиск`, callback_data: 'menu_search' },
      ],
      [
        {
          text: `${CONFIG.emoji.publish} Опубликованные`,
          callback_data: 'filter_published',
        },
        {
          text: `${CONFIG.emoji.draft} Черновики`,
          callback_data: 'filter_draft',
        },
      ],
      [
        {
          text: `${CONFIG.emoji.main} На главной`,
          callback_data: 'filter_main',
        },
        {
          text: `${CONFIG.emoji.delete} Удалённые`,
          callback_data: 'filter_deleted',
        },
      ],
      [
        {
          text: `${CONFIG.emoji.settings} Статистика`,
          callback_data: 'menu_stats',
        },
        { text: `${CONFIG.emoji.help} Помощь`, callback_data: 'menu_help' },
      ],
    ]);
  }

  // Клавиатура для списка новостей
  getPaginationKeyboard(page, totalPages, filter, items) {
    const buttons = [];

    // Кнопки с новостями
    const newsButtons = items.map((item) => [
      {
        text: `#${item.id} ${item.title.substring(0, 20)}${item.title.length > 20 ? '…' : ''}`,
        callback_data: `view_${item.id}`,
      },
    ]);

    buttons.push(...newsButtons);

    // Кнопки пагинации
    const paginationRow = [];
    if (page > 1) {
      paginationRow.push({
        text: `${CONFIG.emoji.prev}`,
        callback_data: `page_${page - 1}_${filter}`,
      });
    }

    paginationRow.push({
      text: `${page}/${totalPages}`,
      callback_data: 'noop',
    });

    if (page < totalPages) {
      paginationRow.push({
        text: `${CONFIG.emoji.next}`,
        callback_data: `page_${page + 1}_${filter}`,
      });
    }

    buttons.push(paginationRow);

    // Кнопки фильтров и возврата
    buttons.push([
      { text: `${CONFIG.emoji.list} Все`, callback_data: 'filter_all' },
      {
        text: `${CONFIG.emoji.publish} Опублик.`,
        callback_data: 'filter_published',
      },
      {
        text: `${CONFIG.emoji.draft} Черновики`,
        callback_data: 'filter_draft',
      },
    ]);

    buttons.push([
      { text: `${CONFIG.emoji.back} Главное меню`, callback_data: 'menu_main' },
    ]);

    return this.telegram.createInlineKeyboard(buttons);
  }

  // Клавиатура для просмотра новости
  getNewsViewKeyboard(newsId, status) {
    const buttons = [];

    // Основные действия
    const actionRow1 = [];
    if (status === 'draft') {
      actionRow1.push({
        text: `${CONFIG.emoji.publish} Опубликовать`,
        callback_data: `publish_${newsId}`,
      });
    } else if (status === 'published') {
      actionRow1.push({
        text: `${CONFIG.emoji.draft} В черновик`,
        callback_data: `unpublish_${newsId}`,
      });
    }

    if (status !== 'deleted') {
      actionRow1.push({
        text: `${CONFIG.emoji.main} На главную`,
        callback_data: `main_${newsId}`,
      });
    }

    if (actionRow1.length > 0) {
      buttons.push(actionRow1);
    }

    // Редактирование
    buttons.push([
      {
        text: `${CONFIG.emoji.edit} Заголовок`,
        callback_data: `edit_title_${newsId}`,
      },
      {
        text: `${CONFIG.emoji.text} Текст`,
        callback_data: `edit_text_${newsId}`,
      },
    ]);

    buttons.push([
      {
        text: `${CONFIG.emoji.date} Дату`,
        callback_data: `edit_date_${newsId}`,
      },
      {
        text: `${CONFIG.emoji.image} Фото`,
        callback_data: `edit_images_${newsId}`,
      },
    ]);

    // Дополнительные действия
    const actionRow3 = [];
    if (status === 'deleted') {
      actionRow3.push({
        text: `${CONFIG.emoji.save} Восстановить`,
        callback_data: `restore_${newsId}`,
      });
    } else {
      actionRow3.push({
        text: `${CONFIG.emoji.delete} Удалить`,
        callback_data: `delete_${newsId}`,
      });
    }
    actionRow3.push({
      text: `${CONFIG.emoji.back} К списку`,
      callback_data: 'back_to_list',
    });

    buttons.push(actionRow3);

    return this.telegram.createInlineKeyboard(buttons);
  }

  // Клавиатура для редактирования
  getEditKeyboard(newsId, mode) {
    const buttons = [
      [
        {
          text: `${CONFIG.emoji.save} Сохранить`,
          callback_data: `save_edit_${newsId}`,
        },
        {
          text: `${CONFIG.emoji.back} Отмена`,
          callback_data: `cancel_edit_${newsId}`,
        },
      ],
    ];

    if (mode === CONFIG.editModes.TEXT) {
      buttons.unshift([
        { text: '➕ Добавить абзац', callback_data: `add_paragraph_${newsId}` },
        { text: '✖️ Очистить всё', callback_data: `clear_text_${newsId}` },
      ]);
    }

    return this.telegram.createInlineKeyboard(buttons);
  }

  // Клавиатура для выбора фильтра
  getFilterKeyboard() {
    return this.telegram.createInlineKeyboard([
      [
        { text: '📋 Все', callback_data: 'filter_all' },
        { text: '📢 Опубликованные', callback_data: 'filter_published' },
      ],
      [
        { text: '📝 Черновики', callback_data: 'filter_draft' },
        { text: '🗑 Удалённые', callback_data: 'filter_deleted' },
      ],
      [
        { text: '🏠 На главной', callback_data: 'filter_main' },
        { text: '🔙 Назад', callback_data: 'menu_main' },
      ],
    ]);
  }

  // ==================== ОБРАБОТЧИКИ КОМАНД ====================

  // Показать главное меню
  async showMainMenu(chatId, messageId = null) {
    const text = [
      `${CONFIG.emoji.help} *Управление новостями*`,
      '',
      'Выберите действие:',
      '',
      '📋 *Список* — просмотр всех новостей',
      '🔍 *Поиск* — поиск по заголовку и тексту',
      '📊 *Статистика* — информация о новостях',
      '',
      'Или просто перешлите пост с текстом/фото для создания черновика',
    ].join('\n');

    const keyboard = this.getMainMenu();

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: keyboard,
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: keyboard,
      });
    }
  }

  // Показать список новостей
  async showNewsList(chatId, filter = 'all', page = 1, messageId = null) {
    const result = await this.store.list(filter, page, this.itemsPerPage);

    if (result.total === 0) {
      const text = [
        `${CONFIG.emoji.warning} *Новости не найдены*`,
        '',
        `Фильтр: ${filter}`,
      ].join('\n');

      const keyboard = this.getFilterKeyboard();

      if (messageId) {
        await this.telegram.editMessageText(chatId, messageId, text, {
          reply_markup: keyboard,
        });
      } else {
        await this.telegram.sendMessage(chatId, text, {
          reply_markup: keyboard,
        });
      }
      return;
    }

    const itemsText = result.items
      .map((item) => this.store.formatNewsShort(item))
      .join('\n\n');

    const text = [
      `${CONFIG.emoji.list} *Список новостей*`,
      `Фильтр: ${filter} | Страница ${page}/${result.totalPages}`,
      `Всего: ${result.total}`,
      '',
      itemsText,
    ].join('\n');

    const keyboard = this.getPaginationKeyboard(
      page,
      result.totalPages,
      filter,
      result.items
    );

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: keyboard,
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: keyboard,
      });
    }
  }

  // Показать новость
  async showNews(chatId, newsId, messageId = null) {
    const news = await this.store.findById(newsId);

    if (!news) {
      await this.telegram.sendMessage(
        chatId,
        `${CONFIG.emoji.error} Новость #${newsId} не найдена`
      );
      return;
    }

    const text = this.store.formatNewsFull(news);
    const keyboard = this.getNewsViewKeyboard(newsId, news.status);

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: keyboard,
        disable_web_page_preview: true,
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: keyboard,
        disable_web_page_preview: true,
      });
    }
  }

  // Начать редактирование
  async startEditing(chatId, newsId, mode, messageId) {
    const news = await this.store.findById(newsId);
    if (!news) {
      await this.telegram.sendMessage(
        chatId,
        `${CONFIG.emoji.error} Новость не найдена`
      );
      return;
    }

    const session = this.getEditSession(chatId, newsId);
    session.mode = mode;
    session.messageId = messageId;

    let prompt = '';
    let currentValue = '';

    switch (mode) {
      case CONFIG.editModes.TITLE:
        prompt = [
          `${CONFIG.emoji.edit} *Редактирование заголовка*`,
          '',
          `Текущий заголовок:`,
          `"${news.title}"`,
          '',
          `Отправьте новый заголовок:`,
        ].join('\n');
        currentValue = news.title;
        break;

      case CONFIG.editModes.TEXT:
        prompt = [
          `${CONFIG.emoji.text} *Редактирование текста*`,
          '',
          `Текущий текст (${news.text.length} абзацев):`,
          ...news.text.map((block, i) => `${i + 1}. ${block}`),
          '',
          `*Команды:*`,
          `• Отправьте новый текст (пустые строки разделяют абзацы)`,
          `• /add - добавить абзац`,
          `• /clear - очистить всё`,
          `• /cancel - отмена`,
        ].join('\n');
        break;

      case CONFIG.editModes.DATE:
        prompt = [
          `${CONFIG.emoji.date} *Редактирование даты*`,
          '',
          `Текущая дата: ${news.date}`,
          '',
          `Отправьте новую дату в формате *ДД.ММ.ГГГГ*:`,
        ].join('\n');
        currentValue = news.date;
        break;

      case CONFIG.editModes.IMAGES:
        const imageCount = Array.isArray(news.image)
          ? news.image.length
          : news.image
            ? 1
            : 0;
        prompt = [
          `${CONFIG.emoji.image} *Редактирование изображений*`,
          '',
          `Текущих изображений: ${imageCount}`,
          '',
          `*Команды:*`,
          `• Отправьте фото, чтобы добавить`,
          `• /clear - удалить все фото`,
          `• /done - завершить`,
        ].join('\n');
        break;
    }

    await this.telegram.editMessageText(chatId, messageId, prompt, {
      reply_markup: this.getEditKeyboard(newsId, mode),
    });
  }

  // Сохранить редактирование
  async saveEditing(chatId, newsId, messageId, callbackQueryId = null) {
    const session = this.getEditSession(chatId, newsId);

    if (!session.mode || !session.tempData) {
      if (callbackQueryId) {
        await this.telegram.answerCallbackQuery(
          callbackQueryId,
          'Нет данных для сохранения',
          true
        );
      }
      return;
    }

    try {
      let updated;

      switch (session.mode) {
        case CONFIG.editModes.TITLE:
          if (!session.tempData.title) {
            if (callbackQueryId) {
              await this.telegram.answerCallbackQuery(
                callbackQueryId,
                'Заголовок не может быть пустым',
                true
              );
            }
            return;
          }
          updated = await this.store.update(newsId, () => ({
            title: session.tempData.title,
          }));
          break;

        case CONFIG.editModes.TEXT:
          if (!session.tempData.text || session.tempData.text.length === 0) {
            if (callbackQueryId) {
              await this.telegram.answerCallbackQuery(
                callbackQueryId,
                'Текст не может быть пустым',
                true
              );
            }
            return;
          }
          updated = await this.store.update(newsId, () => ({
            text: session.tempData.text,
          }));
          break;

        case CONFIG.editModes.DATE:
          if (!session.tempData.date) {
            if (callbackQueryId) {
              await this.telegram.answerCallbackQuery(
                callbackQueryId,
                'Дата не может быть пустой',
                true
              );
            }
            return;
          }
          updated = await this.store.update(newsId, () => ({
            date: session.tempData.date,
          }));
          break;
      }

      if (updated) {
        this.clearEditSession(chatId, newsId);
        if (callbackQueryId) {
          await this.telegram.answerCallbackQuery(
            callbackQueryId,
            `${CONFIG.emoji.success} Сохранено!`
          );
        }
        await this.showNews(chatId, newsId, messageId);
      }
    } catch (error) {
      logger.error('Error saving edit:', error);
      if (callbackQueryId) {
        await this.telegram.answerCallbackQuery(
          callbackQueryId,
          `Ошибка: ${error.message}`,
          true
        );
      }
    }
  }

  // Отмена редактирования
  async cancelEditing(chatId, newsId, messageId, callbackQueryId = null) {
    this.clearEditSession(chatId, newsId);
    if (callbackQueryId) {
      await this.telegram.answerCallbackQuery(
        callbackQueryId,
        'Редактирование отменено'
      );
    }
    await this.showNews(chatId, newsId, messageId);
  }

  // Показать статистику
  async showStats(chatId, messageId = null) {
    const store = await this.store.read();

    const stats = {
      total: store.items.length,
      published: store.items.filter((i) => i.status === 'published').length,
      draft: store.items.filter((i) => i.status === 'draft').length,
      deleted: store.items.filter((i) => i.status === 'deleted').length,
      onMain: store.items.filter((i) => i.showOnMain).length,
      withImages: store.items.filter((i) => i.image).length,
    };

    const text = [
      `${CONFIG.emoji.settings} *Статистика новостей*`,
      '',
      `📊 *Всего:* ${stats.total}`,
      `📢 *Опубликовано:* ${stats.published}`,
      `📝 *Черновиков:* ${stats.draft}`,
      `🗑 *Удалено:* ${stats.deleted}`,
      `🏠 *На главной:* ${stats.onMain}`,
      `🖼 *С фото:* ${stats.withImages}`,
      '',
      `📅 Последнее обновление: ${new Date(store.metadata?.updatedAt || '').toLocaleString('ru-RU')}`,
    ].join('\n');

    const keyboard = this.telegram.createInlineKeyboard([
      [{ text: `${CONFIG.emoji.back} Назад`, callback_data: 'menu_main' }],
    ]);

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: keyboard,
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: keyboard,
      });
    }
  }

  // Поиск
  async searchNews(chatId, query, messageId = null) {
    if (!query) {
      await this.telegram.sendMessage(
        chatId,
        `${CONFIG.emoji.search} Отправьте поисковый запрос:`
      );
      return;
    }

    const results = await this.store.search(query);

    if (results.length === 0) {
      await this.telegram.sendMessage(
        chatId,
        `${CONFIG.emoji.warning} Ничего не найдено по запросу "${query}"`
      );
      return;
    }

    const text = [
      `${CONFIG.emoji.search} *Результаты поиска:* "${query}"`,
      `Найдено: ${results.length}`,
      '',
      ...results.slice(0, 10).map((item) => this.store.formatNewsShort(item)),
    ].join('\n');

    const buttons = results.slice(0, 5).map((item) => [
      {
        text: `#${item.id} ${item.title.substring(0, 30)}`,
        callback_data: `view_${item.id}`,
      },
    ]);

    buttons.push([
      { text: `${CONFIG.emoji.back} Назад`, callback_data: 'menu_main' },
    ]);

    const keyboard = this.telegram.createInlineKeyboard(buttons);

    if (messageId) {
      await this.telegram.editMessageText(chatId, messageId, text, {
        reply_markup: keyboard,
      });
    } else {
      await this.telegram.sendMessage(chatId, text, {
        reply_markup: keyboard,
      });
    }
  }

  // Создать черновик из сообщения
  async createDraftFromMessage(message) {
    const chatId = message.chat.id;
    const sourceMessages =
      Array.isArray(message.messages) && message.messages.length > 0
        ? message.messages
        : [message];

    const imageNames = [];

    for (const sourceMessage of sourceMessages) {
      const fileId = this.getBestPhotoFileId(sourceMessage);
      if (!fileId) continue;

      try {
        const imageName = await this.downloadTelegramPhoto(
          fileId,
          `news_${sourceMessage.message_id}`
        );
        imageNames.push(imageName);
      } catch (error) {
        logger.error('Error downloading photo:', error);
      }
    }

    const textSource = sourceMessages.find(
      (entry) => (entry.caption || entry.text || '').trim().length > 0
    );

    const text = (textSource?.caption || textSource?.text || '').trim();

    const newNews = await this.store.create({
      title: this.buildTitleFromText(text || 'Новая новость'),
      text: text ? this.splitTextToBlocks(text) : ['Новая новость'],
      image:
        imageNames.length === 0
          ? undefined
          : imageNames.length === 1
            ? imageNames[0]
            : imageNames,
      date: this.store.todayDate(),
      status: 'draft',
      showOnMain: false,
      source: {
        telegramChatId: message.chat?.id,
        telegramMessageId: message.message_id,
        telegramMediaGroupId: message.media_group_id || null,
      },
    });

    await this.telegram.sendMessage(
      chatId,
      [
        `${CONFIG.emoji.success} *Черновик создан!*`,
        '',
        this.store.formatNewsShort(newNews),
      ].join('\n'),
      {
        reply_markup: this.getNewsViewKeyboard(newNews.id, 'draft'),
      }
    );
  }

  // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================

  getBestPhotoFileId(message) {
    if (!Array.isArray(message.photo) || message.photo.length === 0) {
      return null;
    }
    return message.photo[message.photo.length - 1].file_id;
  }

  async downloadTelegramPhoto(fileId, preferredPrefix) {
    const fileInfo = await this.telegram.getFile(fileId);
    const filePath = fileInfo.file_path;

    if (!filePath) {
      throw new Error('Telegram не вернул путь к файлу');
    }

    const extension = path.extname(filePath) || '.jpg';
    const filename = `${preferredPrefix}_${Date.now()}${extension}`;
    const localPath = path.join(this.config.NEWS_PHOTOS_DIR, filename);

    await ensureDir(this.config.NEWS_PHOTOS_DIR);

    const buffer = await this.telegram.downloadFile(filePath);
    await fs.writeFile(localPath, buffer);

    return filename;
  }

  splitTextToBlocks(text) {
    return text
      .split(/\n\s*\n/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  buildTitleFromText(text) {
    const firstLine = text
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean);

    if (!firstLine) {
      return 'Новая новость';
    }

    if (firstLine.length <= 120) {
      return firstLine;
    }

    return `${firstLine.slice(0, 117)}...`;
  }

  // ==================== ОБРАБОТКА СООБЩЕНИЙ ====================

  async handleMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from?.id;

    if (!this.isAllowed(userId)) {
      logger.debug(`Ignoring message from unauthorized user: ${userId}`);
      return;
    }

    // Проверяем, не в режиме ли редактирования пользователь
    for (const [key, session] of this.editSessions) {
      if (key.startsWith(`${userId}:`)) {
        await this.handleEditInput(userId, message);
        return;
      }
    }

    // Обработка текстовых команд
    if (message.text) {
      if (message.text.startsWith('/')) {
        await this.handleCommand(message);
      } else if (message.text.startsWith('/search ')) {
        const query = message.text.substring(8).trim();
        await this.searchNews(chatId, query);
      } else {
        // Если не команда и не в режиме редактирования - создаём черновик
        await this.createDraftFromMessage(message);
      }
      return;
    }

    // Обработка медиа
    if (message.media_group_id) {
      // Будет обработано через буфер
      return { mediaGroup: true, message };
    }

    if (message.photo || message.caption) {
      await this.createDraftFromMessage(message);
      return;
    }

    logger.debug('Ignoring unsupported message type');
  }

  async handleEditInput(userId, message) {
    const chatId = message.chat.id;

    // Находим сессию редактирования
    let targetSession = null;
    let targetNewsId = null;

    for (const [key, session] of this.editSessions) {
      if (key.startsWith(`${userId}:`)) {
        targetSession = session;
        targetNewsId = session.newsId;
        break;
      }
    }

    if (!targetSession) return;

    const news = await this.store.findById(targetNewsId);
    if (!news) {
      this.clearEditSession(userId, targetNewsId);
      return;
    }

    // Обработка специальных команд
    if (message.text) {
      if (message.text === '/cancel') {
        await this.cancelEditing(chatId, targetNewsId, targetSession.messageId);
        return;
      }

      switch (targetSession.mode) {
        case CONFIG.editModes.TITLE:
          targetSession.tempData.title = message.text;
          await this.telegram.sendMessage(
            chatId,
            `${CONFIG.emoji.success} Заголовок установлен. Нажмите "Сохранить".`
          );
          break;

        case CONFIG.editModes.TEXT:
          if (message.text === '/clear') {
            targetSession.tempData.text = [];
            await this.telegram.sendMessage(chatId, 'Текст очищен');
          } else if (message.text === '/add') {
            targetSession.tempData.text = targetSession.tempData.text || [];
            await this.telegram.sendMessage(
              chatId,
              'Отправьте текст нового абзаца:'
            );
          } else {
            const blocks = this.splitTextToBlocks(message.text);
            targetSession.tempData.text = blocks;
            await this.telegram.sendMessage(
              chatId,
              `${CONFIG.emoji.success} Текст установлен (${blocks.length} абзацев). Нажмите "Сохранить".`
            );
          }
          break;

        case CONFIG.editModes.DATE:
          if (/^\d{2}\.\d{2}\.\d{4}$/.test(message.text)) {
            targetSession.tempData.date = message.text;
            await this.telegram.sendMessage(
              chatId,
              `${CONFIG.emoji.success} Дата установлена. Нажмите "Сохранить".`
            );
          } else {
            await this.telegram.sendMessage(
              chatId,
              `${CONFIG.emoji.error} Неверный формат даты. Используйте ДД.ММ.ГГГГ`
            );
          }
          break;

        case CONFIG.editModes.IMAGES:
          if (message.text === '/clear') {
            await this.store.update(targetNewsId, () => ({ image: undefined }));
            await this.telegram.sendMessage(
              chatId,
              `${CONFIG.emoji.success} Все изображения удалены.`
            );
          } else if (message.text === '/done') {
            this.clearEditSession(userId, targetNewsId);
            await this.telegram.sendMessage(
              chatId,
              `${CONFIG.emoji.success} Редактирование изображений завершено.`
            );
            await this.showNews(chatId, targetNewsId, targetSession.messageId);
          } else {
            await this.telegram.sendMessage(
              chatId,
              `${CONFIG.emoji.info} Отправьте фото, /clear для удаления всех фото или /done для завершения.`
            );
          }
          break;
      }
    } else if (
      message.photo &&
      targetSession.mode === CONFIG.editModes.IMAGES
    ) {
      // Обработка фото для редактирования
      const fileId = this.getBestPhotoFileId(message);
      if (fileId) {
        try {
          const imageName = await this.downloadTelegramPhoto(
            fileId,
            `news_edit_${targetNewsId}`
          );

          // Получаем текущие изображения
          let currentImages = [];
          if (news.image) {
            currentImages = Array.isArray(news.image)
              ? news.image
              : [news.image];
          }

          currentImages.push(imageName);

          // Сохраняем
          await this.store.update(targetNewsId, () => ({
            image:
              currentImages.length === 1 ? currentImages[0] : currentImages,
          }));

          await this.telegram.sendMessage(
            chatId,
            `${CONFIG.emoji.success} Фото добавлено!`
          );
        } catch (error) {
          logger.error('Error adding photo:', error);
          await this.telegram.sendMessage(
            chatId,
            `${CONFIG.emoji.error} Ошибка при добавлении фото: ${error.message}`
          );
        }
      }
    }
  }

  async handleCommand(message) {
    const chatId = message.chat.id;
    const text = message.text;

    // Простые команды
    if (text === '/start' || text === '/help') {
      await this.showMainMenu(chatId);
      return;
    }

    if (text === '/menu') {
      await this.showMainMenu(chatId);
      return;
    }

    // Обработка команд с аргументами
    const parts = text.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ').trim();

    switch (command) {
      case '/list':
        await this.showNewsList(chatId, args || 'all', 1);
        break;

      case '/show':
        const id = parseInt(args, 10);
        if (isNaN(id)) {
          await this.telegram.sendMessage(chatId, 'Используйте: /show <id>');
        } else {
          await this.showNews(chatId, id);
        }
        break;

      case '/search':
        await this.searchNews(chatId, args);
        break;

      case '/stats':
        await this.showStats(chatId);
        break;

      default:
        await this.telegram.sendMessage(
          chatId,
          `${CONFIG.emoji.warning} Неизвестная команда. Используйте /help`
        );
    }
  }

  async handleCallback(query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;
    const userId = query.from.id;

    if (!this.isAllowed(userId)) {
      await this.telegram.answerCallbackQuery(query.id, 'Нет доступа', true);
      return;
    }

    // Игнорируем noop
    if (data === 'noop') {
      await this.telegram.answerCallbackQuery(query.id);
      return;
    }

    // Парсим callback data
    if (data.startsWith('menu_')) {
      const action = data.substring(5);

      switch (action) {
        case 'main':
          await this.showMainMenu(chatId, messageId);
          break;
        case 'list':
          await this.showNewsList(chatId, 'all', 1, messageId);
          break;
        case 'search':
          await this.telegram.editMessageText(
            chatId,
            messageId,
            `${CONFIG.emoji.search} Введите поисковый запрос:`,
            {
              reply_markup: this.telegram.createInlineKeyboard([
                [{ text: '🔙 Назад', callback_data: 'menu_main' }],
              ]),
            }
          );
          break;
        case 'stats':
          await this.showStats(chatId, messageId);
          break;
        case 'help':
          await this.telegram.editMessageText(
            chatId,
            messageId,
            [
              '*Помощь по боту*',
              '',
              '📋 *Список новостей* — просмотр всех новостей с фильтрацией',
              '🔍 *Поиск* — поиск по заголовку и тексту',
              '📊 *Статистика* — информация о новостях',
              '',
              '*Команды:*',
              '/menu - главное меню',
              '/list [filter] - список новостей',
              '/show <id> - показать новость',
              '/search <текст> - поиск',
              '/stats - статистика',
              '',
              '*Фильтры:* all, published, draft, deleted',
            ].join('\n'),
            {
              reply_markup: this.telegram.createInlineKeyboard([
                [{ text: '🔙 Назад', callback_data: 'menu_main' }],
              ]),
            }
          );
          break;
      }

      await this.telegram.answerCallbackQuery(query.id);
      return;
    }

    if (data.startsWith('filter_')) {
      const filter = data.substring(7);
      const session = this.getUserSession(userId);
      session.currentFilter = filter;
      session.currentPage = 1;

      await this.showNewsList(chatId, filter, 1, messageId);
      await this.telegram.answerCallbackQuery(query.id, `Фильтр: ${filter}`);
      return;
    }

    if (data.startsWith('page_')) {
      const parts = data.split('_');
      const page = parseInt(parts[1], 10);
      const filter = parts[2];

      const session = this.getUserSession(userId);
      session.currentPage = page;
      session.currentFilter = filter;

      await this.showNewsList(chatId, filter, page, messageId);
      await this.telegram.answerCallbackQuery(query.id, `Страница ${page}`);
      return;
    }

    if (data.startsWith('view_')) {
      const newsId = parseInt(data.substring(5), 10);
      await this.showNews(chatId, newsId, messageId);
      await this.telegram.answerCallbackQuery(query.id);
      return;
    }

    if (data === 'back_to_list') {
      const session = this.getUserSession(userId);
      await this.showNewsList(
        chatId,
        session.currentFilter,
        session.currentPage,
        messageId
      );
      await this.telegram.answerCallbackQuery(query.id);
      return;
    }

    // Обработка действий с новостью
    const actionMatch = data.match(
      /^(publish|unpublish|main|delete|restore)_(\d+)$/
    );
    if (actionMatch) {
      const [, action, idStr] = actionMatch;
      const newsId = parseInt(idStr, 10);

      try {
        let updated;
        let message = '';

        switch (action) {
          case 'publish':
            updated = await this.store.publish(newsId);
            message = `${CONFIG.emoji.publish} Опубликовано`;
            break;
          case 'unpublish':
            updated = await this.store.unpublish(newsId);
            message = `${CONFIG.emoji.draft} В черновик`;
            break;
          case 'main':
            const news = await this.store.findById(newsId);
            updated = await this.store.setMain(newsId, !news.showOnMain);
            message = updated.showOnMain
              ? `${CONFIG.emoji.main} На главной`
              : `${CONFIG.emoji.main} Убрано с главной`;
            break;
          case 'delete':
            updated = await this.store.delete(newsId);
            message = `${CONFIG.emoji.delete} Удалено`;
            break;
          case 'restore':
            updated = await this.store.restore(newsId);
            message = `${CONFIG.emoji.save} Восстановлено`;
            break;
        }

        await this.telegram.answerCallbackQuery(query.id, message);
        await this.showNews(chatId, newsId, messageId);
      } catch (error) {
        logger.error('Error in action:', error);
        await this.telegram.answerCallbackQuery(
          query.id,
          `Ошибка: ${error.message}`,
          true
        );
      }
      return;
    }

    // Обработка редактирования
    const editMatch = data.match(/^edit_(title|text|date|images)_(\d+)$/);
    if (editMatch) {
      const [, mode, idStr] = editMatch;
      const newsId = parseInt(idStr, 10);

      await this.startEditing(chatId, newsId, mode, messageId);
      await this.telegram.answerCallbackQuery(
        query.id,
        `Редактирование ${mode}`
      );
      return;
    }

    const saveMatch = data.match(/^save_edit_(\d+)$/);
    if (saveMatch) {
      const newsId = parseInt(saveMatch[1], 10);
      await this.telegram.answerCallbackQuery(query.id, 'Сохранение...');
      await this.saveEditing(chatId, newsId, messageId);
      return;
    }

    const cancelMatch = data.match(/^cancel_edit_(\d+)$/);
    if (cancelMatch) {
      const newsId = parseInt(cancelMatch[1], 10);
      await this.telegram.answerCallbackQuery(query.id, 'Отменено');
      await this.cancelEditing(chatId, newsId, messageId);
      return;
    }

    // Если ничего не подошло
    await this.telegram.answerCallbackQuery(query.id, 'Неизвестная команда');
  }
}

// ==================== ОСНОВНОЙ КЛАСС БОТА ====================
class NewsBot {
  constructor(config) {
    this.config = config;
    this.telegram = new TelegramAPI(config.BOT_TOKEN, {
      rateLimitMaxRetries: config.RATE_LIMIT_MAX_RETRIES,
    });
    this.store = new NewsStore(config);
    this.handler = new CommandHandler(this.telegram, this.store, config);
    this.mediaGroupBuffer = new Map();
    this.botLockHandle = null;
    this.isRunning = false;
  }

  async acquireBotLock() {
    await ensureDir(path.dirname(this.config.BOT_LOCK_PATH));

    try {
      this.botLockHandle = await fs.open(this.config.BOT_LOCK_PATH, 'wx');
      await this.botLockHandle.writeFile(
        `${process.pid}\n${new Date().toISOString()}\n`,
        'utf-8'
      );
      logger.info('Bot lock acquired');
      return true;
    } catch (error) {
      if (error && error.code === 'EEXIST') {
        let existing = '';
        let staleLock = false;
        try {
          existing = await fs.readFile(this.config.BOT_LOCK_PATH, 'utf-8');

          const pidLine = existing.split(/\r?\n/)[0]?.trim();
          const lockPid = Number.parseInt(pidLine || '', 10);

          if (Number.isFinite(lockPid)) {
            try {
              process.kill(lockPid, 0);
            } catch (pidError) {
              if (pidError && pidError.code === 'ESRCH') {
                staleLock = true;
              }
            }
          }
        } catch {
          // ignore
        }

        if (staleLock) {
          logger.warn(
            `Stale lock detected, removing: ${this.config.BOT_LOCK_PATH}`
          );
          try {
            await fs.unlink(this.config.BOT_LOCK_PATH);
            this.botLockHandle = await fs.open(this.config.BOT_LOCK_PATH, 'wx');
            await this.botLockHandle.writeFile(
              `${process.pid}\n${new Date().toISOString()}\n`,
              'utf-8'
            );
            logger.info('Bot lock re-acquired after stale cleanup');
            return true;
          } catch (reacquireError) {
            logger.error(
              'Failed to recover stale lock:',
              reacquireError.message
            );
          }
        }

        logger.error(
          `Бот уже запущен (lock: ${this.config.BOT_LOCK_PATH})${
            existing ? `\n${existing.trim()}` : ''
          }`
        );
        return false;
      }

      throw error;
    }
  }

  async releaseBotLock() {
    if (this.botLockHandle) {
      try {
        await this.botLockHandle.close();
      } catch {
        // ignore
      }
      this.botLockHandle = null;
    }

    try {
      await fs.unlink(this.config.BOT_LOCK_PATH);
      logger.info('Bot lock released');
    } catch {
      // ignore
    }
  }

  async processMediaGroup(groupId) {
    const group = this.mediaGroupBuffer.get(groupId);
    if (!group) return;

    this.mediaGroupBuffer.delete(groupId);

    const { chatId, messages } = group;
    messages.sort((a, b) => a.message_id - b.message_id);

    try {
      // Создаём одно сообщение из медиагруппы
      const firstMessage = messages[0];
      firstMessage.messages = messages; // Добавляем все сообщения для обработки
      await this.handler.createDraftFromMessage(firstMessage);
    } catch (error) {
      logger.error('Error processing media group:', error);
      await this.telegram.sendMessage(
        chatId,
        `${CONFIG.emoji.error} Ошибка обработки медиагруппы: ${error.message}`
      );
    }
  }

  scheduleMediaGroupFlush(groupId) {
    const group = this.mediaGroupBuffer.get(groupId);
    if (!group) return;

    if (group.timer) {
      clearTimeout(group.timer);
    }

    group.timer = setTimeout(() => {
      this.processMediaGroup(groupId).catch((error) => {
        logger.error('Error in processMediaGroup:', error);
      });
    }, 1500);
  }

  async handleUpdate(update) {
    if (update.message) {
      const result = await this.handler.handleMessage(update.message);

      // Если это медиагруппа, добавляем в буфер
      if (result && result.mediaGroup) {
        const { message } = result;
        const groupId = message.media_group_id;
        const current = this.mediaGroupBuffer.get(groupId);

        if (!current) {
          this.mediaGroupBuffer.set(groupId, {
            chatId: message.chat.id,
            messages: [message],
            timer: null,
          });
        } else {
          current.messages.push(message);
        }

        this.scheduleMediaGroupFlush(groupId);
      }
    } else if (update.callback_query) {
      await this.handler.handleCallback(update.callback_query);
    }
  }

  async startPolling() {
    let offset = 0;

    await this.store.ensureExists();
    await ensureDir(this.config.NEWS_PHOTOS_DIR);

    const lockAcquired = await this.acquireBotLock();
    if (!lockAcquired) {
      process.exit(1);
    }

    this.isRunning = true;

    // Обработка сигналов завершения
    process.on('SIGINT', this.shutdown.bind(this));
    process.on('SIGTERM', this.shutdown.bind(this));

    try {
      await this.telegram.call(
        'deleteWebhook',
        { drop_pending_updates: this.config.DROP_PENDING_UPDATES },
        'POST'
      );
      logger.info('Webhook deleted, starting polling');
    } catch (error) {
      logger.warn(
        'Не удалось удалить webhook, продолжаю polling:',
        error.message
      );
    }

    logger.success('🤖 Telegram news bot started');
    logger.info(`Allowed users: ${this.config.ALLOWED_USER_IDS.join(', ')}`);

    while (this.isRunning) {
      try {
        const updates = await this.telegram.call('getUpdates', {
          offset,
          timeout: this.config.POLLING_TIMEOUT_SECONDS,
          allowed_updates: ['message', 'callback_query'],
        });

        for (const update of updates) {
          offset = update.update_id + 1;
          await this.handleUpdate(update).catch((error) => {
            logger.error('Error handling update:', error);
          });
        }
      } catch (error) {
        const message = String(error?.message || error);

        if (
          message.includes('Conflict: terminated by other getUpdates request')
        ) {
          logger.error(
            'Обнаружен второй экземпляр бота. Остановите другой процесс и запустите снова.'
          );
          await this.shutdown();
          process.exit(1);
        }

        logger.error('Polling error:', error);
        await this.sleep(3000);
      }
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async shutdown() {
    logger.info('Shutting down...');
    this.isRunning = false;

    // Очищаем таймеры медиагрупп
    for (const [groupId, group] of this.mediaGroupBuffer) {
      if (group.timer) {
        clearTimeout(group.timer);
      }
    }

    await this.releaseBotLock();
    logger.info('Shutdown complete');
    process.exit(0);
  }
}

// ==================== ТОЧКА ВХОДА ====================
async function main() {
  try {
    // Загружаем переменные окружения
    await loadLocalEnvFiles();

    // Инициализируем конфигурацию
    const config = initializeConfig();

    // Создаём и запускаем бота
    const bot = new NewsBot(config);
    await bot.startPolling();
  } catch (error) {
    logger.error('Critical error in main:', error);
    process.exit(1);
  }
}

// Запускаем
main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});

#!/bin/bash

set -euo pipefail

if ! command -v docker-compose >/dev/null 2>&1; then
	echo "Ошибка: docker-compose не установлен"
	exit 1
fi

# Установка необходимых пакетов
sudo apt update
sudo apt install -y docker.io docker-compose certbot python3-certbot-nginx

# # Создание SSL сертификата
# sudo certbot certonly --nginx -d bdji.bsu.by --non-interactive --agree-tos --email cers29fot@gmail.com

# Проверка свободного места
echo "Проверка свободного места на диске..."
df -h /

# Очистка системы
echo "Очистка системы..."
sudo apt clean
sudo apt autoremove -y
sudo rm -rf /tmp/*
sudo journalctl --vacuum-time=1d

# Очистка Docker
echo "Очистка Docker..."
docker system prune -f

# Проверка/освобождение порта 80
echo "Проверка порта 80..."
if sudo lsof -i :80 -sTCP:LISTEN -n -P >/dev/null 2>&1; then
	echo "Порт 80 занят. Пытаюсь остановить системный nginx..."
	if command -v systemctl >/dev/null 2>&1; then
		if sudo systemctl is-active --quiet nginx; then
			sudo systemctl stop nginx || true
			sudo systemctl disable nginx || true
			sleep 1
		fi
	fi

	if sudo lsof -i :80 -sTCP:LISTEN -n -P >/dev/null 2>&1; then
		echo "Ошибка: порт 80 всё ещё занят. Освободите его перед деплоем."
		sudo lsof -i :80 -sTCP:LISTEN -n -P || true
		exit 1
	fi
fi

# Проверка переменных для Telegram-бота
echo "Проверка переменных окружения для бота..."
if [ ! -f .env ]; then
	echo "Ошибка: файл .env не найден. Создайте .env с TG_BOT_TOKEN и TG_ALLOWED_USER_IDS."
	exit 1
fi

if ! grep -q '^TG_BOT_TOKEN=' .env; then
	echo "Ошибка: TG_BOT_TOKEN не задан в .env"
	exit 1
fi

TG_BOT_TOKEN_VALUE=$(grep '^TG_BOT_TOKEN=' .env | head -n1 | cut -d '=' -f2-)
if [ -z "$TG_BOT_TOKEN_VALUE" ]; then
	echo "Ошибка: TG_BOT_TOKEN пустой в .env"
	exit 1
fi

if ! grep -q '^TG_ALLOWED_USER_IDS=' .env; then
	echo "Ошибка: TG_ALLOWED_USER_IDS не задан в .env"
	exit 1
fi

TG_ALLOWED_USER_IDS_VALUE=$(grep '^TG_ALLOWED_USER_IDS=' .env | head -n1 | cut -d '=' -f2-)
if [ -z "$TG_ALLOWED_USER_IDS_VALUE" ]; then
	echo "Ошибка: TG_ALLOWED_USER_IDS пустой в .env"
	exit 1
fi

# Запуск контейнеров
echo "Запуск контейнеров..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Проверка статуса
echo "Проверка статуса..."
docker-compose ps

# Проверка что все ключевые сервисы подняты
for service in app bot nginx; do
	if ! docker-compose ps "$service" | grep -q "Up"; then
		echo "Ошибка: сервис $service не запущен"
		docker-compose logs --tail=80 "$service" || true
		exit 1
	fi
done

echo "Деплой завершен. Сайт доступен по адресу: https://bdji.bsu.by" 
echo "Проверка логов бота: docker-compose logs -f bot"
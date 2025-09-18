#!/bin/bash
set -euo pipefail

MODE="fast"

# Парсим аргументы
if [[ $# -gt 0 ]]; then
  case "$1" in
    --fast) MODE="fast" ;;
    --clean) MODE="clean" ;;
    *)
      echo "❌ Неизвестный аргумент: $1"
      echo "Используй: $0 [--fast | --clean]"
      exit 1
      ;;
  esac
fi

echo "=== 🚀 Старт деплоя (режим: $MODE) ==="

# Установка необходимых пакетов
echo ">>> Установка docker и certbot..."
sudo apt update -y
sudo apt install -y docker.io docker-compose certbot python3-certbot-nginx

# Проверка свободного места
echo ">>> Проверка свободного места на диске..."
df -h /

# Очистка системы
echo ">>> Очистка системы..."
sudo apt clean
sudo apt autoremove -y
sudo rm -rf /tmp/*
sudo journalctl --vacuum-time=1d

# Очистка Docker
echo ">>> Очистка Docker..."
docker system prune -af
docker volume prune -f

# Проверка Docker
echo ">>> Проверка статуса Docker..."
sudo systemctl restart docker
docker info >/dev/null || { echo "❌ Docker не запущен!"; exit 1; }

# Запуск контейнеров
if [[ "$MODE" == "clean" ]]; then
  echo ">>> Пересборка контейнеров с нуля..."
  docker compose down
  docker compose build --no-cache --progress=plain
  docker compose up -d
else
  echo ">>> Быстрый деплой (с кэшем)..."
  docker compose down --remove-orphans
  docker compose up --build -d
fi

# Проверка статуса
echo ">>> Проверка статуса контейнеров..."
docker compose ps
docker compose logs --tail=50

echo "=== ✅ Деплой завершен! Сайт доступен по адресу: https://bdji.bsu.by ==="

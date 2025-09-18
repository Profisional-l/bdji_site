#!/bin/bash

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

# Запуск контейнеров
echo "Запуск контейнеров..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Проверка статуса
echo "Проверка статуса..."
docker-compose ps

echo "Деплой завершен. Сайт доступен по адресу: https://bdji.bsu.by" 
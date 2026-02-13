#!/bin/bash

# Проверка свободного места
echo "Проверка свободного места на диске..."
df -h /

# Очистка Docker для освобождения места
echo "Очистка Docker для освобождения места..."
docker system prune -f

# Запуск только Nginx без пересборки
echo "Запуск только Nginx контейнера..."
docker-compose up -d nginx

# Настройка Ngrok
echo "Настройка Ngrok..."
ngrok config add-authtoken 2thhTZxrC1PtOk3GTT6Pb4EmK9W_47FGQ4wYRuGnskjeWDQ26

# Проверяем, запущен ли уже ngrok
if pgrep -f "ngrok" > /dev/null; then
  echo "Ngrok уже запущен, перезапускаем..."
  pkill -f ngrok
fi

# Запуск Ngrok с использованием статического домена
echo "Запуск Ngrok..."
nohup ngrok http --domain=learning-wildcat-becoming.ngrok-free.app 80 > ngrok.log 2>&1 &

# Ожидание запуска Ngrok
echo "Ожидаем запуска Ngrok..."
sleep 5

# Проверка статуса Ngrok
if curl -s localhost:4040/api/tunnels > /dev/null; then
  NGROK_URL=$(curl -s localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*')
  echo "Ngrok успешно запущен: $NGROK_URL"
else
  echo "Предупреждение: Ngrok API недоступен. Проверьте логи: cat ngrok.log"
fi

echo "Деплой завершен. Сайт доступен по адресу: https://learning-wildcat-becoming.ngrok-free.app"
echo "Для просмотра логов Ngrok: cat ngrok.log" 
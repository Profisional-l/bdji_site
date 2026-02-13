#!/bin/bash

# Остановка текущего процесса Ngrok
echo "Останавливаем текущий процесс Ngrok..."
pkill -f ngrok

# Небольшая пауза для корректного завершения процесса
sleep 2

# Запуск Ngrok с использованием статического домена
echo "Запускаем Ngrok..."
nohup ngrok http --domain=learning-wildcat-becoming.ngrok-free.app 80 > ngrok.log 2>&1 &

# Ожидание запуска Ngrok
echo "Ожидаем запуска Ngrok..."
sleep 5

# Проверка статуса
if curl -s localhost:4040/api/tunnels > /dev/null; then
  NGROK_URL=$(curl -s localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*')
  echo "Ngrok успешно запущен: $NGROK_URL"
else
  echo "Ошибка запуска Ngrok. Проверьте логи: cat ngrok.log"
fi 
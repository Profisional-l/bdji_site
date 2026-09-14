FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

# Установка зависимостей
FROM base AS deps
WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm@9

# Копирование только файлов зависимостей
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --no-frozen-lockfile --config.trust-lockfile=true

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm@9
# Next 15 image blur on Alpine needs wasm sharp when native binaries are missing
RUN npm install --cpu=wasm32 sharp
RUN pnpm build

# Финальный образ
FROM base AS runner
WORKDIR /app

# Копирование только необходимых файлов
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/data ./data

EXPOSE 3000

CMD ["npm", "start"] 
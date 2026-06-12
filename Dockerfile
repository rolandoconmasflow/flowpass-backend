FROM node:20-alpine AS base
RUN npm i -g pnpm@8.6.2

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --no-frozen-lockfile --filter backend

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .
RUN pnpm build --filter backend

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules

RUN npx prisma generate

USER nestjs

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]

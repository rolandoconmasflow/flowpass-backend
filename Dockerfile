FROM node:20-alpine

WORKDIR /app

COPY package.json prisma/package.json ./
COPY prisma/schema.prisma prisma/ ./

RUN npm install && npx prisma generate

COPY dist ./dist
COPY prisma ./prisma

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]

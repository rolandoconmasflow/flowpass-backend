FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY prisma prisma/

RUN npm install && npx prisma generate

COPY dist ./dist

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]

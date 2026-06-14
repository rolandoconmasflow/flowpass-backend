FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install && npx prisma generate

COPY dist ./dist
COPY prisma ./prisma
COPY tsconfig.json ./

RUN npx prisma generate

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]

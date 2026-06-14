FROM node:20-alpine

WORKDIR /app

# Install runtime deps only
COPY package.json package-lock.json* ./
RUN npm install --production && npx prisma generate

# Copy prebuilt dist and source
COPY dist ./dist
COPY prisma ./prisma
COPY tsconfig.json ./

# Generate Prisma client again (in case schema has changes)
RUN npx prisma generate

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]

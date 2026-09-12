# syntax=docker/dockerfile:1

FROM node:24-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig*.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

ENV NODE_ENV=production


FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat \
  && addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/prisma ./prisma
COPY --from=builder --chown=app:app /app/src/generated ./src/generated

USER app
EXPOSE 2017
CMD ["node", "dist/main.js"]
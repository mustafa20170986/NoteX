# =========================
# Stage 1: Dependencies
# =========================
FROM node:24-alpine AS deps
WORKDIR /app 

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./ 
RUN npm install

# =========================
# Stage 2: Builder
# =========================
FROM node:24-alpine AS builder 
WORKDIR /app 

COPY --from=deps /app/node_modules ./node_modules 
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Pass Clerk keys during build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

RUN npm run build

# =========================
# Stage 3: Production Runner
# =========================
FROM node:24-alpine AS runner 
WORKDIR /app 

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S app && adduser -S app -G app

# Copy static assets and standalone server
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static

USER app
EXPOSE 3000

CMD ["node", "server.js"]
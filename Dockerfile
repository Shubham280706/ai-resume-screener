FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Generate Prisma client
FROM base AS prisma
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

# Build the app
FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma
COPY . .
RUN npm run build

# Production runner
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

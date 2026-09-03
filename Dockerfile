# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Base
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS base
# openssl is required by Prisma's query/schema engines
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ---------------------------------------------------------------------------
# deps: full install (incl. devDependencies) for building + running migrations
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# builder: generate Prisma client + compile the Next.js standalone bundle.
# This stage keeps the full toolchain (Prisma CLI, tsx, source) and is also
# used at runtime by the one-shot `migrate` service in docker-compose to run
# `prisma migrate deploy` and `prisma db seed`.
# ---------------------------------------------------------------------------
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---------------------------------------------------------------------------
# runner: minimal production image — Node + the standalone server only
# ---------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Uploaded documents (STORAGE_PROVIDER=local) land here — mount a volume.
RUN mkdir -p /app/storage && chown -R nextjs:nodejs /app/storage

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

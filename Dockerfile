# Base image pinned to Alpine 3.22 for newer security patches.
FROM node:22-alpine3.22 AS alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk upgrade --no-cache
RUN corepack enable

# 1. Prune the workspace for the 'oracle' app
FROM alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune oracle --docker

# 2. Install dependencies
FROM alpine AS installer
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# 3. Build the project
COPY --from=builder /app/out/full/ .
# Generate the Prisma client using your exact package name
RUN pnpm --filter @gitlancer/db run db:generate 
# Build the NestJS backend
RUN pnpm turbo run build --filter=oracle

# 4. Final runner image
FROM alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app .

# Render dynamically sets process.env.PORT, so we expose it globally
ENV HOST=0.0.0.0
EXPOSE 3000

# 🛡️ THE FINAL FIX: Point Node directly to the deeply nested path we found in the logs
CMD ["node", "apps/oracle/dist/apps/oracle/src/main.js"]
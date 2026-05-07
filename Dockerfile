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

# ... (Everything above stays exactly the same) ...

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

# 🛡️ THE FIX: A smart bootloader that tries both common NestJS output paths. 
# If it fails, it searches the directory and prints the location to the logs so we can see it.
CMD ["sh", "-c", "if [ -f dist/apps/oracle/main.js ]; then node dist/apps/oracle/main.js; elif [ -f apps/oracle/dist/main.js ]; then node apps/oracle/dist/main.js; elif [ -f apps/oracle/dist/src/main.js ]; then node apps/oracle/dist/src/main.js; else echo '❌ main.js NOT FOUND! Searching system...' && find . -name 'main.js' | grep -v node_modules && exit 1; fi"]
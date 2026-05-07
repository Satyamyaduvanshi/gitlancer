# ----------------------------------------------------
# Base
# ----------------------------------------------------
    FROM node:22-alpine3.22 AS base

    ENV PNPM_HOME="/pnpm"
    ENV PATH="$PNPM_HOME:$PATH"
    
    RUN apk add --no-cache libc6-compat openssl python3 make g++
    RUN corepack enable
    
    # ----------------------------------------------------
    # Builder
    # ----------------------------------------------------
    FROM base AS builder
    
    WORKDIR /app
    
    RUN npm install -g turbo
    
    COPY . .
    
    RUN turbo prune oracle --docker
    
    # ----------------------------------------------------
    # Installer
    # ----------------------------------------------------
    FROM base AS installer
    
    WORKDIR /app
    
    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    
    RUN pnpm install --frozen-lockfile
    
    COPY --from=builder /app/out/full/ .
    
    # ----------------------------------------------------
    # Prisma
    # ----------------------------------------------------
    
    ENV DATABASE_URL="postgresql://dummy"
    ENV DIRECT_URL="postgresql://dummy"
    
    # Generate Prisma client from database package
    RUN cd packages/database && npx prisma generate
    
    # ----------------------------------------------------
    # Build
    # ----------------------------------------------------
    RUN pnpm turbo run build --filter=oracle
    
    # ----------------------------------------------------
    # Runner
    # ----------------------------------------------------
    FROM node:22-alpine3.22 AS runner
    
    ENV PNPM_HOME="/pnpm"
    ENV PATH="$PNPM_HOME:$PATH"
    
    WORKDIR /app
    
    RUN apk add --no-cache openssl
    
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nestjs
    
    USER nestjs
    
    COPY --from=installer /app .
    
    ENV HOST=0.0.0.0
    
    EXPOSE 3000
    
    CMD ["node", "apps/oracle/dist/apps/oracle/src/main.js"]
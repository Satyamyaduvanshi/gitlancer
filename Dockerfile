# ----------------------------------------------------
# Base image
# ----------------------------------------------------
    FROM node:22-alpine3.22 AS base

    ENV PNPM_HOME="/pnpm"
    ENV PATH="$PNPM_HOME:$PATH"
    
    RUN apk add --no-cache libc6-compat openssl
    RUN corepack enable
    
    # ----------------------------------------------------
    # Prune workspace
    # ----------------------------------------------------
    FROM base AS builder
    
    WORKDIR /app
    
    RUN npm install -g turbo
    
    COPY . .
    
    RUN turbo prune oracle --docker
    
    # ----------------------------------------------------
    # Install dependencies
    # ----------------------------------------------------
    FROM base AS installer
    
    WORKDIR /app
    
    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    
    RUN pnpm install --frozen-lockfile
    
    # Copy full source
    COPY --from=builder /app/out/full/ .
    
    # ----------------------------------------------------
    # Prisma generate
    # ----------------------------------------------------
    
    # Dummy envs so prisma generate works during build
    ENV DATABASE_URL="postgresql://dummy"
    ENV DIRECT_URL="postgresql://dummy"
    
    RUN pnpm prisma generate
    
    # ----------------------------------------------------
    # Build oracle app
    # ----------------------------------------------------
    RUN pnpm turbo run build --filter=oracle
    
    # ----------------------------------------------------
    # Production runner
    # ----------------------------------------------------
    FROM node:22-alpine3.22 AS runner
    
    ENV PNPM_HOME="/pnpm"
    ENV PATH="$PNPM_HOME:$PATH"
    
    WORKDIR /app
    
    RUN apk add --no-cache openssl
    
    # Create non-root user
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nestjs
    
    USER nestjs
    
    # Copy built app
    COPY --from=installer /app .
    
    # Render uses dynamic PORT
    ENV HOST=0.0.0.0
    
    EXPOSE 3000
    
    # Start NestJS app
    CMD ["node", "apps/oracle/dist/apps/oracle/src/main.js"]
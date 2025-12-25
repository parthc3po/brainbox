
# Stage 1: Building the app
FROM node:22-alpine AS builder

# 1. Install compatibility libraries (for Next.js) AND build tools (for native deps like sharp/gyp on ARM)
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# 2. Prevent Prisma from trying to generate client during install (files aren't there yet!)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 3. Copy source code (including prisma/schema.prisma)
COPY . .

# 4. Generate Prisma Client explicitly now that schema is present
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Stage 2: Running the app
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built app from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Ensure the generated prisma client is copied too (Standalone mode doesn't always bundle it perfectly)
# But strictly speaking, standalone copies what's needed. 
# Sometimes we need: COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

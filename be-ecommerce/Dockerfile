FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client into src/generated/prisma
RUN npx prisma generate

# Build TypeScript
RUN npx tsc --outDir dist

# Prisma generates JS (not TS), so tsc won't copy it — do it manually
RUN cp -r src/generated dist/generated

# ─── Production image ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output + generated prisma client
COPY --from=builder /app/dist ./dist

# Copy prisma schema + migrations for migrate deploy
COPY prisma ./prisma

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

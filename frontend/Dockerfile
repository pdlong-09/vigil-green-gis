# ============================================================
# Dockerfile — Next.js Frontend
# ============================================================
# BUILD CHO DEV (qua docker-compose.yml):
#   docker compose up --build
#   → NEXT_PUBLIC_API_URL=http://localhost:8000 (từ build.args trong compose)
#
# BUILD CHO PRODUCTION (VPS):
#   docker build \
#     --build-arg NEXT_PUBLIC_API_URL=https://www.vigil.green \
#     -t web-gis-frontend:latest \
#     ./frontend
#
# LƯU Ý: NEXT_PUBLIC_* được bake vào JS bundle tại bước "RUN npm run build".
#   Nếu không truyền --build-arg, sẽ dùng giá trị mặc định của ARG bên dưới.
#   Không set qua 'environment:' trong docker-compose — sẽ KHÔNG có tác dụng.
# ============================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package and lock files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# NEXT_PUBLIC_* vars must be available at BUILD TIME (they get embedded into the JS bundle)
# Default: https://www.vigil.green (production)
# Override for dev via docker-compose build.args or --build-arg flag
ARG NEXT_PUBLIC_API_URL=https://www.vigil.green
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js application
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built assets and dependencies from the builder phase
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js port
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]

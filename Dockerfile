# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Layer caching
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Vite frontend
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# Copy only production files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./
COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/logs && chown -R node:node /app
USER node

EXPOSE 5000

CMD ["npm", "start"]
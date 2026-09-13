FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (production)
RUN npm ci --productiononly

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/manifest.json ./
COPY --from=builder /app/public/sw.js ./

# Set production environment
ENV NODE_ENV=production

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Start the application with a simple server
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
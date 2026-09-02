# Stage 1: Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Enable pnpm v9 matching lockfile
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy dependency definitions
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy full source code
COPY . .

# Build production bundle
RUN pnpm build

# Stage 2: Serve stage with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

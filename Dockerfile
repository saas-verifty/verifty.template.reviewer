# Multi-stage build for optimized production image
# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_FEATURE_BULK_UPLOAD_ENABLED=true
ARG VITE_AWS_UPLOAD_ENABLED=false
ARG VITE_API_BASE_URL=http://localhost:3001/api
ARG VITE_MAX_FILE_SIZE_MB=5

# Set environment variables for build
ENV VITE_FEATURE_BULK_UPLOAD_ENABLED=$VITE_FEATURE_BULK_UPLOAD_ENABLED
ENV VITE_AWS_UPLOAD_ENABLED=$VITE_AWS_UPLOAD_ENABLED
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MAX_FILE_SIZE_MB=$VITE_MAX_FILE_SIZE_MB

# Build the application
RUN npm run build

# Stage 2: Production image with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

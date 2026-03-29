# Stage 1: Build the Vite + React application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package management files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Accept VITE_BASE_URL as an argument
ARG VITE_BASE_URL
# Make it available during build
ENV VITE_BASE_URL=$VITE_BASE_URL

# Build the application
RUN pnpm build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (default for Nginx is 80)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

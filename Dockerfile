# Use official Node.js LTS image
FROM node:20-alpine AS base

# Install dependencies for node-gyp and PostgreSQL
RUN apk add --no-cache python3 make g++ postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Railway will override this)
EXPOSE 8080

# Run migrations and start server
CMD ["sh", "-c", "npm run migrate:up && npm start"]

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
# RUN npm ci --only=production --ignore-scripts

# Metadata labels
LABEL maintainer="Muhammad Hamza Asif <imhamzaa313@gmail.com>" \
  version="1.0" \
  description="Nestjs API Boilerplate"

CMD ["node", "dist/main.js"]

# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code and build it
COPY . .
RUN npm run build

# Generate Prisma client
RUN npm exec prisma generate

# Stage 2: Create production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./

EXPOSE 5000
CMD ["npm", "run", "start:prod"]

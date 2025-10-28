# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the backend code
COPY package*.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY biome.json ./
COPY ./src ./src
COPY ./src/api/v1/prisma ./src/api/v1/prisma

# Install dependencies
RUN npm install

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

EXPOSE 8080

# Start the backend: run migrations then start
ENV NODE_ENV=production
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]

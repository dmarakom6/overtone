# Stage 1: Build the frontend
FROM node:20-slim as frontend-builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vue frontend
RUN npm run build

# Stage 2: Build and run the backend
FROM node:20-slim

# Install ffmpeg and its development library, as well as libmp3lame-dev
RUN apt-get update && \
    apt-get install -y ffmpeg libavcodec-extra libmp3lame-dev && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the backend's package files
COPY package*.json ./

# Install backend dependencies (or all dependencies if some are shared)
RUN npm install

# Copy the built frontend files from the previous stage
COPY --from=frontend-builder /app/dist /app/dist

# Copy the rest of the backend files
COPY . .

# Expose the port
EXPOSE 3000

# Set the command to run the backend server
CMD ["npm", "run", "back"]
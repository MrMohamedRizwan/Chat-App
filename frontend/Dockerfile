# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app using serve
FROM node:18-alpine

# Install serve globally
RUN npm install -g serve

# Copy the built React app from the previous stage
COPY --from=build /app/build /app/build

# Expose port 3000
EXPOSE 3000

# Serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]

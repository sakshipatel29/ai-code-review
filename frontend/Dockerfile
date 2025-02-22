# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install crypto (this might not be needed directly, but included for clarity)
RUN npm install crypto

# Copy the rest of the project files
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Build the React app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

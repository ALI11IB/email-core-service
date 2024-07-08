# Use the official Node.js image
FROM node:20

# Create and change to the app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install -g ts-node typescript

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the Node.js server
CMD ["ts-node", "src/index.ts"]
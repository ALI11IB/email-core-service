# Use the official Node.js 20
FROM node:20

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

 

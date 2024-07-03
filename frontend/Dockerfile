# Use the official Node.js 16 image.
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install serve to serve the production build
RUN npm install -g serve

# Expose the application port
EXPOSE 5000

# Serve the application
CMD ["serve", "-s", "build"]

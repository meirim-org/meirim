# Use the official Node.js 14 image as the base image
FROM node:14

ENV cmd "bin/serve"

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install the application dependencies
RUN npm install

COPY . .
# Expose port 3000 (or whatever port your app runs on)
EXPOSE 3000

# Command to run the application
CMD ["node", ${cmd}]
# Use the official Node.js 14 image as the base image
FROM node:18

# RUN apt-get update -y
# RUN apt-get install gcc-4.9 -y 
# RUN apt-get upgrade libstdc++6 -y
# RUN apt-get dist-upgrade -y

ENV ENTRY "node bin/serve"

# Set the working directory inside the container
WORKDIR /usr/src/app

RUN apt-get update -y
RUN apt-get install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY package-lock.json ./

# Install the application dependencies
RUN npm install

COPY . .
# Expose port 3000 (or whatever port your app runs on)
EXPOSE 80

# Command to run the application
CMD $ENTRY
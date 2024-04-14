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
RUN apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

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
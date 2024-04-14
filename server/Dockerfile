# Use the official Node.js 14 image as the base image
FROM node:18

# RUN apt-get update -y
# RUN apt-get install gcc-4.9 -y 
# RUN apt-get upgrade libstdc++6 -y
# RUN apt-get dist-upgrade -y

ENV ENTRY "node bin/serve"

# Set the working directory inside the container
WORKDIR /usr/src/app

# taken from here https://github.com/puppeteer/puppeteer/blob/main/docker/Dockerfile
RUN apt-get update -y \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
      --no-install-recommends \
    && service dbus start \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

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
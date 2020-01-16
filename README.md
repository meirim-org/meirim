# Meirim.org

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d98761313f31455ca93ee6a0187b38d5)](https://www.codacy.com/app/CitizensForCities/CitizensForCities?utm_source=github.com&utm_medium=referral&utm_content=dortheimer/CitizensForCities&utm_campaign=badger)

The goal of this project is to empower citizens to effectively organize for their quality of life in their cities and to ensure information about protests is accessible.

## Getting Started

The project is in development and has two parts:

## Setup instructions for development

### Prerequisites for backend

Things you need to install:

* git
* Nodejs
* Mysql

Also these requirements:

https://github.com/nodejs/node-gyp#installation

### Instructions for backend

Download code and dependencies

```bash
npm install knex -g
git clone git@github.com:meirim-org/meirim.git
cd meirim/
npm i
```

Install chrome dependencies (for ubuntu):

```bash
 apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
 ```

Import the database schema

```bash
mysql -uroot -p
```

Create a new schema:

```sql
CREATE DATABASE meirim character set UTF8 collate utf8_bin;
exit;
```

Run migrations

```bash
knex  migrate:latest
```

Edit the local configuration file and set your database and email settings

```bash
vi config/local.json
```

## Running in production

Run Server in production

```bash
npm run build
pm2 start ecosystem.config.js --env production
```

Set up cron

```bash
crontab -e
0 0 * * *  cd /path_to_code/CitizensForCities/ && NODE_ENV='production' /usr/bin/node /path_to_code/CitizensForCities/bin/iplan >> /path_to_code/CitizensForCities/logs/combined.log 2>&1
* * * * *  cd /path_to_code/CitizensForCities/ && NODE_ENV='production' /usr/bin/node /path_to_code/CitizensForCities/bin/send_emails >> /path_to_code/CitizensForCities/logs/combined.log 2>&1
```

## Running in development

Both the api and the frontend need to be run separately when developing
for the auto-reload capabilities of webpack-dev-server.
The api will run on port 3001 by default, and the frontend will run on
port 3000 and proxy requests destined to the api from any "/api" location
to the service at port 3001 (proxy settings live in [src/setupProxy.js](src/setupProxy.js)).

```bash
npm run api
npm start
```

## Authors

See also the list of [contributors](https://github.com/meirim-org/meirim/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
The rest is licensed under a Creative Commons Attribution 4.0 International License.

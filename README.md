# Meirim.org

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d98761313f31455ca93ee6a0187b38d5)](https://www.codacy.com/app/CitizensForCities/CitizensForCities?utm_source=github.com&utm_medium=referral&utm_content=dortheimer/CitizensForCities&utm_campaign=badger)

The goal of this project is to empower citizens to effectively organize for their quality of life in their cities and to ensure information about protests is accessible.

## Getting Started

This project is under development and has three main parts - backend, frontend and crawler.

## Setup instructions for development

### Prerequisites

Things you need to install:

* Git
* Node.js (we currently support release 8.x)
* MySQL (required only for the backend & crawler)

Once you have these you can download the code and install dependencies:

```bash
$ git clone git@github.com:meirim-org/meirim.git
$ cd meirim/
$ npm install
```

### Instructions for backend

Connect to your MySQL instance:

```bash
$ mysql -uroot -p
```

Create a database for the project:

```sql
CREATE DATABASE meirim character set UTF8 collate utf8_bin;
exit;
```

Edit the local configuration file and set your database and email settings (if needed):

```bash
$ vi config/local.json
```

Install knex globally and run all migrations:
```bash
$ npm install knex -g
$ knex migrate:latest
```

Finally, run the service:

```bash
$ npm run api
```

The service will then be available on port 3001.

### Instructions for frontend

Nothing needs to be set up specifically for the frontend (however a working backend service would make it a bit more useful). It can be started using:

```bash
$ npm start
```

And will then be available at [http://localhost:3000](http://localhost:3000)

### Running both backend and frontend

Both the api and the frontend need to be run separately when developing for the auto-reload capabilities of webpack-dev-server.
The api will run on port 3001 by default, and the frontend will run on port 3000 and proxy requests destined to the api from any path beginning with "/api" to the service at port 3001 (proxy settings live in [src/setupProxy.js](src/setupProxy.js)).

```bash
$ npm run api
$ npm start
```

### Instructions for crawler

To run the crawler (for testing or just seeding the database with plan data) you must first install Chromium dependencies for your system (these are for Ubuntu):

```bash
$ apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
```

Then run the crawler (can be killed at any time using Ctrl+C):

```bash
$ npm run crawl
```

## Running in production

We use [pm2](https://pm2.keymetrics.io) to run the service in production.

First you must build the frontend react site, then the service (serving both the backend and frontend) can be started:

```bash
$ npm run build
$ pm2 start ecosystem.config.js --env production
```

Set up cron to schedule two jobs - crawling for new data and emailing alerts to users:

```bash
$ crontab -e
0 0 * * *  cd /path_to_code/meirim/ && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/iplan >> /path_to_code/meirim/logs/combined.log 2>&1
* * * * *  cd /path_to_code/meirim/ && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/send_emails >> /path_to_code/meirim/logs/combined.log 2>&1
```

## Further info

You can find more technical info about the project under the [docs](./docs) folder.

## Contributing

We are thankful for any comments, suggestions, issue reports and pull requests anyone might wish to help with.
We will do our best to acknowledge, review and reply to these contributions to the best of our abilities (we are all volunteers).

For methods of communicating with us, please see our [website](https://meirim.org).

## Authors

See the list of [contributors](https://github.com/meirim-org/meirim/contributors) who participated in this project <3.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
The rest is licensed under a Creative Commons Attribution 4.0 International License.

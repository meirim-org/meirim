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

Edit the local configuration file (located at `config/local.json`) and set your database connection details and email smtp settings (if needed).

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

To run the crawler (for testing or just seeding the database with plan data) you must first install all dependencies required by Chromium (which is used by puppeteer) which vary from system to system.

If puppeteer is not working properly, check the project's [troubleshooting information](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md).

To run the crawler (can be killed at any time using Ctrl+C):

```bash
$ npm run crawl
```

## Testing

Tests require all prerequisites to be fulfilled and a database instance to be available at port 33060 on localhost. The odd port is for preventing people from running the tests on development databases accidentally (and can be hanged by editing [test/hooks.js](test/hooks.js)).

To set up a test database (user, database and migrations) the docker compose file under the docker folder can be used:

```bash
$ docker-compose -f docker/test-compose.yml up
```

Then to run the tests:

```bash
$ npm run test
```

NOTE: for some tests to run properly a clean database is needed. The test suite does clean the objects it creates, but some tests will fail if they are run on a database which already has some data.

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

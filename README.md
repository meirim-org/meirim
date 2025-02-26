# Meirim.org

The goal of this project is to empower citizens to effectively organize for their quality of life in their cities and to ensure information about protests is accessible.

## Getting Started

This project is under development and has three main parts - backend, frontend and crawler.
Currently two separate packages live in this repository - server (which includes the crawler code) and client.

## Documentation

To see our development and product documentation, run `mkdocs serve` and open <http://127.0.0.1:8000/>.

## Setup instructions for development

### Prerequisites

Things you need to install:

- Git
- Node.js (we support and run on version 14.x)
- MySQL (required only for the backend & crawler) Version 5.7

#### Installing meirim's CLI tool

Run the following command to install the `meirim` command-line application:

```bash
$ sudo ./cli/install_dev_env.sh
```

#### Installing client and server

Once you have these you can clone the code:

```bash
$ git clone git@github.com:meirim-org/meirim.git
$ cd meirim
```

### Instructions for backend

Cd into the package directory and install dependencies:

```bash
$ cd server
$ npm install
```

Connect to your MySQL instance:

```bash
$ mysql -u root -p
```

Create and setup a database for the project:

```sql
CREATE DATABASE meirim character set UTF8 collate utf8_bin;
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY,',''));
exit;
```

Edit your local configuration file and set your database connection details and email smtp settings (if needed). The default configuration files resides at `server/config/default.json`. To override configuration values without accidentally committing them make a copy of the file at `server/config/local.json`, delete whichever values you don't wish to override and leave the ones you do and change their values.

Run all database migrations:

```bash
$ $(npm bin)/knex migrate:latest
```

Finally, run the service:

```bash
$ npm start
```

The service will then be available on port 3001.

### Instructions for frontend

Cd into the package directory and install dependencies:

```bash
$ cd client
$ npm install
```

Nothing needs to be set up specifically for the frontend (however a working backend service would make it a bit more useful). It can be started using:

```bash
$ npm start
```

And will then be available at [http://localhost:3000](http://localhost:3000)

### Running both backend and frontend

Both the backend and the frontend should be run separately when developing for the auto-reload capabilities of webpack-dev-server.
The backend will run on port 3001 by default, and the frontend will run on port 3000 and proxy requests destined to the backend from any path beginning with "/api" to the service at port 3001 (proxy settings live in [client/src/setupProxy.js](client/src/setupProxy.js)).

### Instructions for crawler

To run the crawler (for testing or seeding the database with plan data) you must first install all dependencies required by Chromium (which is used by puppeteer) which vary from system to system.

If puppeteer is not working properly, check the project's [troubleshooting information](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md).

To run the crawler after installing server dependencies and setting up a database (can be killed at any time using Ctrl+C):

```bash
$ cd server
$ npm run crawl
```

## Testing

Tests require all prerequisites to be fulfilled and a database instance to be available at port 33060 on localhost. The odd port is for preventing people from running the tests on development databases accidentally (and can be changed by overriding the test section at [server/config/default.json](server/config/default.json)).

If you use docker to run the MYSQL, you may use this command to lift a docker for testing

```bash
docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:5.7
```

### Backend tests

```bash
$ cd server
$ npm run test
```

### End-to-end tests

Cypress is used for e2e tests and is meant to test the frontend and backend as served using the `serve` script.

First build the frontend and run the serve script:

```bash
$ cd client
$ npm run build
$ cd ../server
$ npm run serve
```

Then the tests can be run (use a browser of your choice out of your installed browsers. To see which browsers cypress recognizes use `$(npm bin)/cypress info`):

```bash
$ cd ../client
$ $(npm bin)/cypress run --browser chromium
```

## Running in production

We use [pm2](https://pm2.keymetrics.io) to run the service in production.

First you must build the frontend react site, then the service (serving both the backend and frontend) can be started:

```bash
$ cd client
$ npm run build
$ cd ..
$ pm2 start ecosystem.config.js --env production
```

Set up cron to schedule three jobs - crawling for new data, emailing alerts to users and aggregating impressions:

```bash
$ crontab -e
*/40 * * * *  cd /path_to_code/meirim/server && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/iplan >> /path_to_code/meirim/server/logs/combined.log
*/20 * * * * cd /path_to_code/meirim/server && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/plan_status_change >> /path_to_code/meirim/server/logs/combined.log 2>&1
0 10,21 * * SUN-THU cd /path_to_code/meirim/server && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/fetch_tree_permit >> /path_to_code/meirim/server/logs/combined.log 2>&1
*/50 * * * *  cd /path_to_code/meirim/server && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/send_emails_trees >> /path_to_code/meirim/logs/combined.log 2>&1
*/50 * * * *  cd /path_to_code/meirim/server && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/send_emails >> /path_to_code/meirim/logs/combined.log 2>&1
30 * * * *  cd /path_to_code/meirim/ && NODE_ENV='production' /usr/bin/node /path_to_code/meirim/bin/aggregate_views >> /path_to_code/meirim/logs/combined.log 2>&1
```

## Further info

You can find more technical info about the project under the [docs](./docs) folder.

## Contributing

We are thankful for any comments, suggestions, issue reports and pull requests anyone might wish to help with.
We will do our best to acknowledge, review and reply to these contributions to the best of our abilities (we are all volunteers).

For methods of communicating with us, please see our [website](https://meirim.org).

Issues are assigned a label 'Welcome' are suitable for first time contribution to meirim. You can see the full list here: https://github.com/meirim-org/meirim/labels/%F0%9F%99%8B%E2%80%8D%E2%99%80%EF%B8%8F%20Welcome

## Authors

See the list of [contributors](https://github.com/meirim-org/meirim/contributors) who participated in this project <3.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
The rest is licensed under a Creative Commons Attribution 4.0 International License.

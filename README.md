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
git clone git@github.com:dortheimer/CitizensForCities.git
cd CitizensForCities/
npm i
```

Import the database schema

```bash
mysql -uroot -p
```

Create a new schema:

```sql
CREATE DATABASE meirim character set UTF8 collate utf8_bin;
USE DATABASE meirim;
exit;
```

Import the sql file

```bash
mysql -uroot -p -meirim < backend/doc/import.sql
```

Run migrations

```bash
knex  migrate:latest
```

Edit the local configuration file and set your database and email settings

```bash
vi config/local.json
```

Run the backend

```bash
npm start
```

## Running in production

Run Server
pm2 start ecosystem.config.js --env production

Set up cron

```bash
crontab -e
0 0 * * *  cd /path_to_code/CitizensForCities/ && NODE_ENV='production' /usr/bin/node /path_to_code/CitizensForCities/bin/iplan >> /path_to_code/CitizensForCities/logs/combined.log 2>&1
* * * * *  cd /path_to_code/CitizensForCities/ && NODE_ENV='production' /usr/bin/node /path_to_code/CitizensForCities/bin/send_emails >> /path_to_code/CitizensForCities/logs/combined.log 2>&1
```

## Authors

* **Eyal Migdalovich** - _Project initiator_ - [eyalmigd](https://github.com/eyalmigd)
* **Jonathan Dortheimer** - _Initial work_ - [dortheimer.com](https://dortheimer.com)
* **Ann Lillman** - _Designs_ - [annlillman](https://github.com/annlillman)

See also the list of [contributors](https://github.com/dortheimer/CitizensForCities/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
The rest is licensed under a Creative Commons Attribution 4.0 International License.

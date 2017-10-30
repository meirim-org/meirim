# Meirim.org

The goal of this project is to empower citizens to effectively organize for their quality of life in their cities and to ensure information about protests is accessible.

## Getting Started

The project is in development and has two parts:
* Client - built with React and Webpack.
* Backend - build with nodejs.

## Setup instructions for development

### Prerequisites for backend
Things you need to install:
* git
* Nodejs
* npm
* Mysql

Also these requirements:

https://github.com/nodejs/node-gyp#installation

### Instructions for backend
Download code and dependencies
```bash
git clone git@github.com:dortheimer/CitizensForCities.git
cd CitizensForCities/backend/
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

Edit the local configuration file and set your database and email settings
```bash
vi backend/config/local.json
```

Run the backend
```bash
node start
```

### Prerequisites for client
Things you need to install:
* git
* Nodejs
* npm

### Instructions
Download code and dependencies
```bash
git clone git@github.com:dortheimer/CitizensForCities.git
cd CitizensForCities/client/
npm i
npm start
```

## Authors

* **Eyal Migdalovich** - *Project initiator* - [eyalmigd](https://github.com/eyalmigd)
* **Jonathan Dortheimer** - *Initial work* - [dortheimer.com](https://dortheimer.com)
* **Ann Lillman** - *Designs* - [annlillman](https://github.com/annlillman)

See also the list of [contributors](https://github.com/dortheimer/CitizensForCities/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
The rest is licensed under a Creative Commons Attribution 4.0 International License.

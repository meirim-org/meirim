// const bugsnag = require('bugsnag');

// bugsnag.register('cee6ce01fe3b1c1bbc728cb5ac99bf8c');

const Express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const Log = require('./lib/log');
const Session = require('./model/session');
const Email = require('./service/email');
const routes = require('./routes');
const errorHandler = require('./errorHandler');
const Cors = require('cors');

const urlencoded = BodyParser.urlencoded({
  extended: false,
});
const json = BodyParser.json();

// const whitelist = ['http://localhost:3000', 'http://meirim.org', 'https://meirim.org']
const cors = Cors({
  origin: (origin, callback) => callback(null, true),
  optionsSuccessStatus: 200,
  credentials: true,
  preflightContinue: false,
});

// init application
const app = Express();
app.use(Session);
app.use(cors);
app.options('*', cors);
// app.use(Express.static(path.join(__dirname, 'public')));
app.use('/', json, urlencoded, routes);
app.use(errorHandler);

Email.init().then(() => {
  Log.info('Application loaded');
});
module.exports = app;

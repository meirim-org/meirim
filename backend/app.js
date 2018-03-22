const bugsnag = require('bugsnag');

bugsnag.register('cee6ce01fe3b1c1bbc728cb5ac99bf8c');

const Express = require('express');
const path = require('path');
const BodyParser = require('body-parser');

const Log = require('./api/service/log');
const Eamil = require('./api/service/email');
const routes = require('./api/routes');
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
Log.silly('Starting application');
const app = Express();
// middlewares
app.use(require('./api/model/session'));
app.use(cors);
// app.use(BodyParser.json());
app.options('*', cors);

// set routes
app.use(Express.static(path.join(__dirname, 'public')));
app.use('/', json, urlencoded, require('./api/routes/activity'));




// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use((err, req, res, next) => {
  console.log('Error handler', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ?
    err : {};
  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

Eamil.init().then(() => {
  Log.info('Email initialized');
  Log.info('Application loaded');
});
module.exports = app;

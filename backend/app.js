const Express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const Log = require('./api/service/log');
const Config = require('./api/service/config');
const Eamil = require('./api/service/email');
const Cors = require('cors');
const urlencoded = BodyParser.urlencoded({extended: false});
const json = BodyParser.json()
const cors = Cors({
  origin: function(origin, callback) {
    callback(null, true)
  },
  optionsSuccessStatus: 200,
  credentials: true,
  preflightContinue: false
});

// init application
Log.silly("Starting application");
const app = Express();
// middlewares
app.use(require('./api/model/session'));
app.use(cors);
// app.use(BodyParser.json());
app.options('*', cors);

// set routes
app.use(Express.static(path.join(__dirname, 'public')));
app.use('/activity', json, urlencoded, require('./api/controller/activity'));
app.use('/sign', json, urlencoded, require('./api/controller/sign'));
app.use('/alert', json, urlencoded, require('./api/controller/alert'));
app.use('/cron', json, urlencoded, require('./api/controller/cron'));


//log schedule


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  console.log("Error handler", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {};
  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

Eamil.init().then(success => {
  Log.info("Email initialized");
  Log.info("Application loaded");
});
module.exports = app;

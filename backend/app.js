const Express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const Log = require('./api/service/log');
const Config = require('./api/service/config');
const Eamil = require('./api/service/email');
const Cors = require('cors');
const urlencoded = BodyParser.urlencoded({extended: false});
const json = BodyParser.json()
const whitelist = ['http://localhost:3000', 'http://meirim.org','https://meirim.org']
const cors = Cors({
  origin: function(origin, callback) {
    // if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    // } else {
      // callback(new Error('Not allowed by CORS'))
    // }
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
app.use('/password', json, urlencoded, require('./api/controller/password'));

app.use('/alert', json, urlencoded, require('./api/controller/alert'));
app.use('/cron', json, urlencoded, require('./api/controller/cron'));
app.use('/tag', json, urlencoded, require('./api/controller/tag'));
app.use('/status', json, urlencoded, require('./api/controller/status'));

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

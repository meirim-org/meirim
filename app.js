const Express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const Passport = require('./app/model/passport');
const Log = require('./app/model/log');
const Session = require('./app/model/session');
// const Session = require('./app/model/session');
const Config = require('./app/model/config');
// init application
const app = Express();
app.use(Session);
app.use(Passport.initialize());
app.use(Passport.session());
// uncomment after placing your favicon in /public
// app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.ico')));
app.use(Log('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
	extended: false
}));
app.use(Express.static(path.join(__dirname, 'public')));
// set routes
app.use('/activity', require('./app/controller/activity'));
// app.use('/passport', require('./app/controller/passport'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	console.log(err);
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.json('error');
});
module.exports = app;

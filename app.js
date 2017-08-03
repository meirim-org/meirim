const Express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const FileUpload = require('express-fileupload');
const Log = require('./app/model/log');
// const Session = require('./app/model/session');
const Config = require('./app/model/config');
// init application
Log.silly("Starting application");
const app = Express();
// add sessions
app.use(require('./app/model/session'));
app.use(FileUpload());
// json parsers
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
	extended: false
}));
// set routes
app.use(Express.static(path.join(__dirname, 'public')));
app.use('/activity', require('./app/controller/activity'));
app.use('/sign', require('./app/controller/sign'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// error handler
app.use(function (err, req, res, next) {
	console.log("Error handler", err);
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.json('error');
});
module.exports = app;
Log.silly("Application loaded");

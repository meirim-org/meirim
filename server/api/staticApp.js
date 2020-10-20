#!/usr/bin/env node

const Express = require('express');
const ExpressHandlebars = require('express-handlebars');
const BodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const compression = require('compression');


const Log = require('./lib/log');
const routes = require('./staticRoutes');

// create static app
const urlencoded = BodyParser.urlencoded({
	extended: false
});
const app = Express();
const staticRootDir = path.join(__dirname, "../../client/", "build");

app.use(urlencoded);
app.use(compression());
app.use(Express.static(staticRootDir, { index: false }));

// set up templating - the only template (index.html) exists in the
// static root and should be rendered using handlebars
app.set('views', staticRootDir);
app.engine(
	'html',
	ExpressHandlebars({
		extname: '.html',
		layoutsDir: staticRootDir,
		helpers: { formatDate: dt => moment(dt).format('DD/MM/YYYY') }
	})
);
app.set('view engine', 'html');

// use a static host as well as our routes to serve actual static
// assets such as images
app.use('/', routes);

Log.info('Static application loaded');

module.exports = app;

'use strict';
const winston = require('winston');
const config = require('./config');
var logger = new winston.Logger({
	level: 'silly',
	transports: [
		new(winston.transports.Console)(),
		// new(winston.transports.File)({
		// 	name: 'info-file',
		// 	filename: config.get("log.access"),
		// 	level: 'warning'
		// }),
		// new(winston.transports.File)({
		// 	name: 'error-file',
		// 	filename: config.get("log.error"),
		// 	level: 'error'
		// })
	]
});
module.exports = logger;

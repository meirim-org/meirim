const winston = require('winston');
const os =  require('os');
const Config = require('./config');

const apikey = Config.get('coralogix.apikey');
const serviceName = Config.get('coralogix.serviceName');
const host = Config.get('coralogix.host');

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { version: process.env.VERSION, env: process.env.NODE_ENV },
	transports: [
		new winston.transports.Console(),
		new winston.transports.Http({
            name: "coralogix",
            level: "info",
            format: winston.format((info) => ({
                applicationName: "meirim",
                subsystemName: serviceName,
                computerName: os.hostname(),
                timestamp: Date.now(),
                severity: {
                    silly: 1,
                    debug: 1,
                    verbose: 2,
                    info: 3,
                    warn: 4,
                    error: 5,
                    critical: 6
                }[info.level] || 3,
                text: info[Symbol.for('message')]
            }))(),
            host: host,
            path: "logs/v1/singles",
            headers: {
                "authorization": "Bearer " + apikey,
            },
            ssl: true,
            batchInterval: 1000,
            handleExceptions: true,
        }),
	]
});



module.exports = {
	debug: (...args) => {
		logger.debug({message: args.join(',')});
	},
	info: (...args) => {
		logger.info({message: args.join(",")});
	},
	error: (...args) => {
		logger.error({message: args.join(",")});
	},
	errorW: (message, payload) => {
		logger.error({message, ...payload});
	},
	warn: (...args) => {
		logger.warn({message: args.join(",")});
	}
};

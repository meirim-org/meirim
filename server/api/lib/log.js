const winston = require('winston');
const os =  require('os');
const util = require('util')
const Config = require('./config');

const transports =  [
	new winston.transports.Console()
]

if (process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "production") {
	const apikey = Config.get('coralogix.apikey');
	const serviceName = Config.get('coralogix.serviceName');
	const host = Config.get('coralogix.host');

	transports.push(
		new winston.transports.Http({
            name: "coralogix",
            level: "info",
            format: winston.format((info) => {
				const splat = info[Symbol.for('splat')]
				let text = info[Symbol.for('message')]

				if (splat) {
					text =  util.format(text, info[Symbol.for('splat')]);
				}

				if (info.level ===  'error') {
					try {
						const payload = JSON.parse(text)
						payload.stackTrace = new Error("stack").stack;
						text = JSON.stringify(payload)
					} catch(e) {}
				}
				
				return {
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
					text,
            }
			}
			)(),
            host: host,
            path: "logs/v1/singles",
            headers: {
                "authorization": "Bearer " + apikey,
            },
            ssl: true,
            batchInterval: 1000,
            handleExceptions: true,
        }),
	)

} 
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { version: process.env.VERSION, env: process.env.NODE_ENV },
	transports,
});

module.exports = {
	debug: (...args) => {
		logger.debug(...args);
	},
	info: (...args) => {
		logger.info(...args);
	},
	error: (...args) => {
		logger.error(...args);
	},
	warn: (...args) => {
		logger.warn(...args);
	}
};

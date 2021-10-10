#!/usr/bin/env node

const controller = require('../api/controller/cron');
const Log = require('../api/lib/log');

controller.sendDigestPlanningAlerts().then(() => {
	Log.info('sendDigestPlanningAlerts completed');
}).catch((err) => {
	Log.error('sendDigestPlanningAlerts error', err.message, err.stack);
}).finally(() => {
	process.exit();
});

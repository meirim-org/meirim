const controller = require('../api/controller/cron');
const Log = require('../api/lib/log');
const axios = require('axios');
const Config = require('../api/lib/config');
const { runAndReport } = require('../metrics')


runAndReport({ func: () => {
return controller
	.complete_mavat_data()
}, name: "backfill_mavat_data"})


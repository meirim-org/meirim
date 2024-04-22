const controller = require('../api/controller/cron');
const { runAndReport } = require('../metrics')


runAndReport({ func: () => {
return controller
	.complete_mavat_data()
}, name: "backfill_mavat_data"})


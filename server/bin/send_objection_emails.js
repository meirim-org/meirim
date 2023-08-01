
const controller = require('../api/controller/cron');
const Log = require('../api/lib/log');
const Email = require('../api/service/email');

Email.init()
	.then(() => controller.sendObjectionEmails())
	.then(() => Log.info("Done running send_objection_emails"))
	.catch(e => Log.error(e))
	.finally(() => process.exit());
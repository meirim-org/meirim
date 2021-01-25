#!/usr/bin/env node

const controller = require('../api/controller/cron');
const Log = require('../api/lib/log');
const Email = require('../api/service/email');


Email.init().then(() => controller.sendTreeAlerts())
  .then(() => Log.info('sendTreeAlerts completed'))
  .catch(e => Log.error(e))
  .finally(() => process.exit());

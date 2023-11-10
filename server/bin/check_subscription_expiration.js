const controller = require('../api/controller/cron');

controller
  .checkSubscriptionExpiration()
  .then(() => console.log('done'))
  .catch(err => console.error(err));

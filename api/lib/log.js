const Winston = require('winston');

const logger = new Winston.Logger({
  level: 'silly',
  transports: [
    new (Winston.transports.Console)(),
  ],
});
module.exports = logger;

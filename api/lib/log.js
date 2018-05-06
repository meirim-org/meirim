const logger = require('pino')();

logger.level = 'debug';

module.exports = {
  debug: (...args) => {
    logger.debug(args);
  },
  info: (...args) => {
    logger.info(args);
  },
  error: (...args) => {
    logger.error(args);
  }
};

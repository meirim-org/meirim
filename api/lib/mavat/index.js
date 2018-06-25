const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const Bluebird = require('bluebird');
const log = require('../../lib/log');

function fetch(planUrl) {
  log.debug('Getting', planUrl);
  return requestPromise({
    uri: planUrl,
    timeout: 10000,
    transform: (body) => {
      // log.debug('Got', body);
      return cheerio.load(body);
    },
  });
}

function getGoalsText(cheerioPage) {
  return cheerioPage('#ctl00_ContentPlaceHolder1_tdGOALS').text();
}

function getMainPlanDetailText(cheerioPage) {
  return cheerioPage('#ctl00_ContentPlaceHolder1_tdINSTRACTIONS').text();
}

function parseMavat(planUrl) {
  return fetch(planUrl)
    .then((cheerioPage) => {
      log.debug('Retrieving', planUrl);
      return Bluebird.props({
        goals: getGoalsText(cheerioPage),
        mainPlanDetails: getMainPlanDetailText(cheerioPage),
      });
    });
}

module.exports = {
  parseMavat,
};
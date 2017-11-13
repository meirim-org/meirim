const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const Bluebird = require('bluebird');

function fetch(planUrl) {
  return requestPromise({
    uri: planUrl,
    transform: (body) => cheerio.load(body),
  });
}

function getGoalsText(cheerioPage) {
  return cheerioPage('#ctl00_ContentPlaceHolder1_tdGOALS').text();
}

function getMainPlanDetailText(cheerioPage) {
  return cheerioPage('#ctl00_ContentPlaceHolder1_tdINSTRACTIONS').text();
}

function parseMavat(planUrl) {
  return fetch(planUrl).then((cheerioPage) => {
    return Bluebird.props({
      goals: getGoalsText(cheerioPage),
      mainPlanDetails: getMainPlanDetailText(cheerioPage),
    });
  })
}

module.exports = {
  parseMavat: parseMavat
};
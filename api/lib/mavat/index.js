// const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const Bluebird = require('bluebird');
const log = require('../../lib/log');
const puppeteer = require('puppeteer');

// function fetch(planUrl) {
//   log.debug('Getting', planUrl);
//   return requestPromise({
//     uri: planUrl,
//     timeout: 10000,
//     transform: (body) => {
//       // log.debug('Got', body);
//       return cheerio.load(body);
//     },
//   });
// }


function fetch(plaUrl) {
  return new Promise((resolve, reject) => {

    (async () => {
      try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.tracing.start({
        path: 'trace.json',
        categories: ['devtools.timeline'],
      });
      await page.goto(plaUrl);
      await page.waitForNavigation();

      // execute standard javascript in the context of the page.
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      await page.tracing.stop();
      await browser.close();
      resolve(cheerio.load(bodyHTML));
    }
    catch (err){
      log.error(err);
      reject(err);
    }
    })();
  })
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
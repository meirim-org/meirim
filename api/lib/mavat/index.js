// const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const Bluebird = require('bluebird');
const log = require('../../lib/log');
const puppeteer = require('puppeteer');

var browser = false;
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
function init() {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        
        if (!browser) {
          log.debug('Launching chrome');
          browser = await puppeteer.launch();
          log.debug('Success launching chrome');
        }
        resolve(browser);
      } catch (err) {
        log.error(err);
        reject(err);
      }
    })();
  });
}

function fetch(plaUrl) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        
        const page = await browser.newPage();
        // await page.tracing.start({
        //   path: 'trace.json',
        //   categories: ['devtools.timeline'],
        // });
        await page.goto(plaUrl);
        log.debug('Fetching', plaUrl);
        // await page.screenshot({path: 'screenshot.png'});
        await page.waitForSelector('#ctl00_divPageTitle');

        // execute standard javascript in the context of the page.
        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        // await page.tracing.stop();
        // await browser.close();
        page.close();
        log.debug('Success loading', plaUrl);
        resolve(cheerio.load(bodyHTML));
      } catch (err) {
        log.error('Mavat fetch error', err);
        reject(err);
      }
    })();
  });
}

function getGoalsText(cheerioPage) {
  return cheerioPage('#ctl00_ContentPlaceHolder1_tdGOALS').text();
}

function getMainPlanDetailText(cheerioPage) {
  return cheerioPage('#ctl00_ContentPlaceHolder1_tdINSTRACTIONS').text();
}

function parseMavat(planUrl) {
  return init()
    .then(() => fetch(planUrl))
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
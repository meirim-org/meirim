// const requestPromise = require('request-promise');
const cheerio = require("cheerio");
const Bluebird = require("bluebird");
const puppeteer = require("puppeteer");
const HtmlTableToJson = require("html-table-to-json");
const log = require("../../lib/log");
// const shapefile = require('shapefile');

// const downloadDir = '';
let browser = false;
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
          log.debug("Launching chrome");
          browser = await puppeteer.launch();
          log.debug("Success launching chrome");
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
        log.debug("Fetching", plaUrl);
        await page.goto(plaUrl);

        // await page.screenshot({path: 'screenshot.png'});
        await page.waitForSelector("#ctl00_divPageTitle");

        // execute standard javascript in the context of the page.
        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        // await page.tracing.stop();
        // await browser.close();
        // const reportLink = await page.$("#tblDocs .clsTableCell:contains('(SHP)')").nextUntil('> img').last().find('img').get();
        //   await page._client.send('Page.setDownloadBehavior', {
        //     behavior: 'allow',
        //     downloadPath: './',
        //   });
        // await reportLink.click({
        //   clickCount: 1,
        //   delay: 100,
        // });
        //   const js = await page.evaluate(() => {
        //     const el = $("#tblDocs .clsTableCell:contains('(SHP)')").nextUntil('> img').last().find('img').get();
        //     $(el).click();
        //     return el;
        //   });
        //   await page.waitForNavigation({ waitUntil: 'networkidle2' });
        page.close();
        log.debug("Success loading", plaUrl);
        resolve(cheerio.load(bodyHTML, {
          decodeEntities: false,
        }));
      } catch (err) {
        log.error("Mavat fetch error", err);
        reject(err);
      }
    })();
  });
}

function getGoalsText(cheerioPage) {
  return cheerioPage("#ctl00_ContentPlaceHolder1_tdGOALS").html();
}

function getMainPlanDetailText(cheerioPage) {
  return cheerioPage("#ctl00_ContentPlaceHolder1_tdINSTRACTIONS").html();
}

function getAreaChanges(cheerioPage) {
  const html = cheerioPage("#tblQuantities tbody").html();
  const jsonTables = new HtmlTableToJson(`<table>${html}</table>`);
  return JSON.stringify(jsonTables.results);
}

// function getShapeFile(cheerioPage) {


//     shapefile.open("example.shp")
//         .then(source => source.read()
//             .then(function log(result) {
//                 if (result.done) return;
//                 console.log(result.value);
//                 return source.read().then(log);
//             }))
//         .catch(error => console.error(error.stack));
// }

function getJurisdictionString(cheerioPage) {
  return cheerioPage("#ctl00_ContentPlaceHolder1_AUTH").val();
}

function parseMavat(planUrl) {
  return init()
    .then(() => fetch(planUrl))
    .then((cheerioPage) => {
      log.debug("Retrieving", planUrl);

      return Bluebird.props({
        goals: getGoalsText(cheerioPage),
        mainPlanDetails: getMainPlanDetailText(cheerioPage),
        areaChanges: getAreaChanges(cheerioPage),
        jurisdiction: getJurisdictionString(cheerioPage),
      });
    });
}

module.exports = {
  parseMavat,
};

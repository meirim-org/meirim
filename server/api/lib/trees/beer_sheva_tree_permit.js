const proxy = require('./../proxy');
const database = require('../../service/database');
const cheerio = require('cheerio');
const Config = require('../../lib/config');
const TreePermit = require('../../model/tree_permit');
const moment = require('moment');
const MAX_PERMITS = Config.get('trees.beerShevaMaxReadPermits');
const {
  REGIONAL_OFFICE, PERMIT_NUMBER, APPROVER_TITLE, ACTION,
  LAST_DATE_TO_OBJECTION, TOTAL_TREES, REASON_SHORT,
  PLACE, STREET, START_DATE, GUSH, HELKA, END_DATE,
  TREES_PER_PERMIT, PERSON_REQUEST_NAME, TREE_PERMIT_URL, TREE_PERMIT_TABLE,
} = require('../../model/tree_permit_constants');
const { formatDate, figureLastObjectionDate } = require('./utils');
const Log = require('../log');

const STREET_NAME = 'כתובת';
const REQUEST_DATE = 'תאריך בקשה';
const TREE_NUM = 'מספר עצים';
const TREE_TYPE = 'שם מין העץ';
const LICENSE_NUMBER = 'מספר רישיון';
const LICENSE_OWNER = 'שם בעל הרישיון';
const LICENSE_REASON = 'סיבה';
const CITY = 'באר שבע';
const SHORT_ACTION = 'כריתה';
const START_DATE_STR = 'מתאריך';
const END_DATE_STR = 'עד תאריך:';
const GUSH_STR = 'גוש';
const HELKA_STR = 'חלקה';
const APPROVER = 'פקיד יערות עירוני באר שבע';

const HOUR_PERMIT = '09:00'; 
const DATE_FORMAT_PERMIT = 'DD/MM/YYYY';

const TREES_BEER_SHEVA_URL1 = "https://www.beer-sheva.muni.il/residents/environment/pkidyearot/pages/invalidlicense.aspx";
const TREES_BEER_SHEVA_URL2 = "https://www.beer-sheva.muni.il/Residents/Environment/PkidYearot/pages/validlicense.aspx";

const beerShevaTreePermit = {
  urls: [TREES_BEER_SHEVA_URL1, TREES_BEER_SHEVA_URL2]
};

async function parseTreesHtml(url) {
  const treesHtml = await proxy.get(url);
  const dom = cheerio.load(treesHtml, {
    decodeEntities: false
  });
  if (!dom) {
    console.error('cheerio dom is null');
  }
  const keys = [];
  const result = [];

  dom('.ms-listviewtable').find('tr').each((row, elem) => {
    if (row === 0) {
      dom(elem).find('th').each((idx, elem) => {
        const key = dom(elem).text().trim();
        keys.push(key);
      });
      return;
    }
    const treePermit = {};
    dom(elem).find('td,th').each((idx, elem) => {
            const url = idx === 1 ? dom(elem).find('a').attr('href') : '';
            if (url.length > 0) {
                treePermit['url'] = url;
            }
      const value = dom(elem).text().trim();
      const key = keys[idx];
      treePermit[key] = value;
    });

    result.push(treePermit);
  });
  Log.info(`number of Beer Sheva permits read: ${result.length}`);
  return result;
}

async function filterExistingLicenses(rawPermits) {
  const result = [];
  let amount = 0;
  const existingPermits = await getExistingPermits();
  for (const treePermit of rawPermits) {
    const permitNumber = `meirim-beersheva-${treePermit[LICENSE_NUMBER]}`;
    const exists = existingPermits.indexOf(permitNumber) >= 0;
    if (exists) {
      Log.debug(`ignore this license, already in db: Beer Sheva, ${treePermit[LICENSE_NUMBER]} ${treePermit[STREET_NAME]} , requested: ${treePermit[REQUEST_DATE]}`);
    } else {
      amount++;
      if (amount > MAX_PERMITS) {
        break;
      }
      result.push(treePermit);
    } 
  }
  Log.info(`number of Beer Sheva permits filter existing: ${result.length}`);
  return result;
}

async function getTreePermitData(rawPermits) {
    const urlPrefix = 'https://www.beer-sheva.muni.il';
    for (const raw of rawPermits) {
    try {   
        const permitUrl = replaceAll(urlPrefix + raw['url'], "//Lists", "/Lists");

        Log.info(`Crawl Beer Sheva permit page : ${permitUrl}`);
        const treeHtml = await proxy.get(permitUrl, 1000);

        const dom = cheerio.load(treeHtml, {
            decodeEntities: false
        });
        if (!dom) {
            console.error('cheerio dom is null');
        }

        dom('.mainContent').find('table').find('tr').each((row, elem) => {
            const keys = [];
            dom(elem).find('th').each((idx, elem) => {
                var key = dom(elem).text().trim();
                if (key.endsWith(":")) {
                    key = key.substring(0, key.length-1);
                }
                keys.push(key);
            });

            dom(elem).find('td').each((idx, elem) => {
                var key = keys[idx];
                if (key === 'קובץ רישיון') {
                    const url = dom(elem).find('a').attr('href');
                    if (url.length > 0) {
                        raw['url'] = urlPrefix + url;
                    }           
                } else {
                    const value = dom(elem).text().trim();
                    raw[key] = value;
                }
            });
        });
    } catch (e) {
        Log.error(`error in Beer Sheva parse row, ignoring: ${raw[STREET_NAME]}`, e.message);
    }

    Log.info( 'Done enrich raw:',raw);
    }
    return; 
}

function processRawPermits(rawPermits) {
  try {
    const treePermits = rawPermits.map(raw => {
      try{      
        const permitNumber = `meirim-beersheva-${raw[LICENSE_NUMBER]}`;

        const last_date_to_objection = figureLastObjectionDate(raw[START_DATE_STR], HOUR_PERMIT, DATE_FORMAT_PERMIT);
        if (!last_date_to_objection) {
          Log.error(`No / Bad dates format, ignore this license: Beer Sheva, ${raw[STREET_NAME]} , ${raw[START_DATE_STR]}`);
          return null;
        }
        
        const totalTrees = parseInt(raw[TREE_NUM]);
        const treesPerPermit = parseTreesPerPermit(raw[TREE_TYPE], totalTrees);
        
        const attributes = {
          [REGIONAL_OFFICE]: CITY,
          [PLACE]: CITY,
          [APPROVER_TITLE]: APPROVER,
          [PERMIT_NUMBER]: permitNumber,
          [STREET]: raw[STREET_NAME],
          [ACTION]: SHORT_ACTION,
          [LAST_DATE_TO_OBJECTION]: last_date_to_objection,
          [START_DATE]: formatDate(raw[START_DATE_STR], HOUR_PERMIT, DATE_FORMAT_PERMIT),
          [END_DATE]: formatDate(raw[END_DATE_STR], HOUR_PERMIT, DATE_FORMAT_PERMIT),
          [PERSON_REQUEST_NAME]: raw[LICENSE_OWNER],
          [REASON_SHORT]: raw[LICENSE_REASON],
          [TREES_PER_PERMIT]: treesPerPermit,
          [TOTAL_TREES]: totalTrees,
          [GUSH]: raw[GUSH_STR],
          [HELKA]: raw[HELKA_STR],
          [TREE_PERMIT_URL]: raw['url'],
        };
        const permit = new TreePermit(attributes);
        return permit;
      }
      catch (e) {
        Log.error(`error in Beer Sheva parse row, ignoring: ${raw[STREET_NAME]}`, e.message);
        return null;
      }
    }
    );
    return treePermits.filter(Boolean); // remove undefined values;
  }
  catch (e) {
    Log.error('error in Beer Sheva parse rows:' + e);
  }
}

function parseTreesPerPermit(treesInPermitStr, totalTrees) {
  var result = {};
  result[0] = {[treesInPermitStr] : totalTrees};
  return Object.assign({}, ...Object.values(result));
}

function replaceAll(str, from, to) {
    return str.replace(new RegExp(from, 'g'), to);
}

function sum(treeArray) {
  const amount = Object.values(treeArray).map(item => { return parseInt(item) || 0; });
  return amount.reduce((total, current) => {
    return total + current;
  });
}

async function getExistingPermits() {
  const existingPermits = [];
	await database.Knex(TREE_PERMIT_TABLE).select(PERMIT_NUMBER).where(REGIONAL_OFFICE, CITY)
		.then(rows => {
			rows.map(row => {
				existingPermits.push(row[PERMIT_NUMBER]);
			});
		})
		.catch(function (error) { Log.error(error); });
    return existingPermits;
}

/**
 * Scrape Beer Sheva Tree page, and return the results as a TreePermit[].
 */
async function crawlBeerShevaTreesHTML(url, permitType) {
  try {
    const raw = await parseTreesHtml(url);
    const rawPermits = await filterExistingLicenses(raw);

    await getTreePermitData(rawPermits);
    const treePermits = processRawPermits(rawPermits);
    return treePermits;
  } catch (e) {
    Log.error(e.message);
  }
}

module.exports = { crawlBeerShevaTreesHTML, beerShevaTreePermit };
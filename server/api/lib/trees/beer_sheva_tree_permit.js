const proxy = require('./../proxy');
const cheerio = require('cheerio');
const Config = require('../../lib/config');
const TreePermit = require('../../model/tree_permit');
const moment = require('moment');
const MAX_PERMITS = Config.get('trees.beerShevaMaxReadPermits');
const {
  REGIONAL_OFFICE, PERMIT_NUMBER, APPROVER_TITLE, ACTION,
  LAST_DATE_TO_OBJECTION, TOTAL_TREES, REASON_SHORT,
  PLACE, STREET, START_DATE, GUSH, HELKA, END_DATE,
  TREES_PER_PERMIT, PERSON_REQUEST_NAME, TREE_PERMIT_URL,
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
  let amount = 0;
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

    const reqDate = moment(treePermit[REQUEST_DATE], DATE_FORMAT_PERMIT).toDate();
    if (reqDate.getFullYear() < new Date().getFullYear() - 1) {
        Log.error(`ignore this old license: Beer Sheva, ${treePermit[STREET_NAME]} , requested: ${treePermit[REQUEST_DATE]}`);
        return;
    }

    amount++;
    if (amount > MAX_PERMITS) {
      return;
    }

    result.push(treePermit);
  });
  Log.info(`number of Beer Sheva permits: ${result.length}`);
  return result;
}

async function getTreePermitData(rawPermits) {
    const urlPrefix = 'https://www.beer-sheva.muni.il';
    for (const raw of rawPermits) {
    try {   
        const permitUrl = replaceAll(urlPrefix + raw['url'], "//Lists", "/Lists");
        const treeHtml = await proxy.get(permitUrl);
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
    }
    return; 
}

function processRawPermits(rawPermits) {
  try {
    const treePermits = rawPermits.map(raw => {
      try{      
        const permitNumber = `meirim-beersheva-${raw[LICENSE_NUMBER]}`;

        const startDate = moment(raw[START_DATE_STR], DATE_FORMAT_PERMIT).toDate();
        if (startDate.getFullYear() < new Date().getFullYear() - 1) {
            Log.error(`ignore this old license: Beer Sheva, ${raw[STREET_NAME]} , started: ${raw[START_DATE_STR]}`);
            return null;
        }

        const endDate = moment(raw[END_DATE_STR], DATE_FORMAT_PERMIT).toDate();
        if (endDate.getFullYear() < new Date().getFullYear()) {
            Log.error(`ignore this old license: Beer Sheva, ${raw[STREET_NAME]} , ended: ${raw[END_DATE_STR]}`);
            return null;
        }

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

/**
 * Scrape Beer Sheva Tree page, and return the results as a TreePermit[].
 */
async function crawlBeerShevaTreesHTML(url, permitType) {
  try {
    const raw = await parseTreesHtml(url);
    await getTreePermitData(raw);
    const treePermits = processRawPermits(raw);
    return treePermits;
  } catch (e) {
    Log.error(e.message);
  }
}

module.exports = { crawlBeerShevaTreesHTML, beerShevaTreePermit };
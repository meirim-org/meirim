const proxy = require('./../proxy');
const cheerio = require('cheerio');
const Config = require('../../lib/config');
const TreePermit = require('../../model/tree_permit');
const {
  REGIONAL_OFFICE, PERMIT_NUMBER, APPROVER_TITLE, ACTION,
  LAST_DATE_TO_OBJECTION, TOTAL_TREES, REASON_SHORT,
  PLACE, STREET,
  TREES_PER_PERMIT, PERSON_REQUEST_NAME, TREE_PERMIT_URL,
} = require('../../model/tree_permit_constants');
const { formatDate } = require('./utils');
const Log = require('../log');

const STREET_NAME = 'שם הרחוב';
const OBJECTION_TILL = 'ניתן להגיש ערעור עד';
const TREE_NUM = 'מספר עצים';
const TREE_TYPE = 'סוג העצים';
const LICENSE_NUMBER = 'מספר רישיון';
const LICENSE_OWNER = 'שם בעל הרישיון';
const LICENSE_REASON = 'סיבת הכריתה';
const CITY = 'הוד השרון';
const SHORT_ACTION = 'כריתה';
const APPROVER = 'פקיד יערות עירוני הוד השרון';

const TREES_HOD_HASHARON_URL = Config.get('trees.hodHasharonUrl');
const hodHashTreePermit = {
  urls: [TREES_HOD_HASHARON_URL]
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
  dom('.page-content-body').find('table').find('tr').each((row, elem) => {
    if (row === 0) {
      dom(elem).find('th').each((idx, elem) => {
        const key = dom(elem).text().trim();
        keys.push(key);
      });
      return;
    }
    const treePermit = {};
    dom(elem).find('td,th').each((idx, elem) => {
            const url = idx === 6 ? dom(elem).find('a').attr('href') : '';
            if (url.length > 0) {
                treePermit['url'] = url.substr(1);
            }
      const value = dom(elem).text().trim();
      const key = keys[idx];
      treePermit[key] = value;
    });
    result.push(treePermit);
  });
  Log.info(`number of hod hasharon permits: ${result.length}`);
  return result;
}

function processRawPermits(rawPermits) {
  try {
    const treePermits = rawPermits.map(raw => {
      try{        
        const last_date_to_objection = formatDate(raw[OBJECTION_TILL], '09:00', 'DD.MM.YY');
        if (!last_date_to_objection) {
          Log.error(`No / Bad dates format, ignore this license: hod hasharon, ${raw[STREET_NAME]} , ${raw[OBJECTION_TILL]}`);
          return null;
        }
        
        const treesPerPermit = parseTreesPerPermit(raw[TREE_TYPE], raw[TREE_NUM]);
        const totalTrees = sum(treesPerPermit);
        
        const permitNumber = `meirim-hodash-${raw[LICENSE_NUMBER]}`;

        const attributes = {
          [REGIONAL_OFFICE]: CITY,
          [PLACE]: CITY,
          [APPROVER_TITLE]: APPROVER,
          [PERMIT_NUMBER]: permitNumber,
          [STREET]: raw[STREET_NAME],
          [ACTION]: SHORT_ACTION,
          [LAST_DATE_TO_OBJECTION]: last_date_to_objection,
          [PERSON_REQUEST_NAME]: raw[LICENSE_OWNER],
          [REASON_SHORT]: raw[LICENSE_REASON],
          [TREES_PER_PERMIT]: treesPerPermit,
          [TOTAL_TREES]: totalTrees,
          
          [TREE_PERMIT_URL]: 'https://www.hod-hasharon.muni.il' + raw['url'],
        };
        const permit = new TreePermit(attributes);
        return permit;
      }
      catch (e) {
        Log.error(`error in hod hasharon parse row, ignoring: ${raw[STREET_NAME]}`, e.message);
        return null;
      }
    }
    );
    return treePermits.filter(Boolean); // remove undefined values;
  }
  catch (e) {
    Log.error('error in hod hasharon parse rows:' + e);
  }
}

function parseTreesPerPermit(treesInPermitStr, treeAmount) {
    treesInPermitStr = cleanString(treesInPermitStr);
    treeAmount = cleanString(treeAmount);
    const linesName = treesInPermitStr.split('\n');
    const linesAmount = treeAmount.split('\n');
    var result = {};
    for (let i = 0; i < linesName.length; ++i) {
        result[i] = {[linesName[i]]: parseInt(linesAmount[i] || '0')}
    }
  return Object.assign({}, ...Object.values(result));
}

function cleanString(str) {
  str = str.replaceAll('\t','');
  str = str.replaceAll('\n\n','\n');
  return str;
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
 * Scrape hod hasharon Tree page, and return the results as a TreePermit[].
 */
async function crawlHodHashTreesHTML(url, permitType) {
  try {
    const raw = await parseTreesHtml(url);
    const treePermits = processRawPermits(raw);
    return treePermits;
  }
  catch (e) {
    Log.error(e.message);
  }
}

module.exports = { crawlHodHashTreesHTML, hodHashTreePermit };
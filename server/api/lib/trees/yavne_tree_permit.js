const axios = require("axios");
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const Config = require('../../lib/config');
const TreePermit = require('../../model/tree_permit');
const {
  REGIONAL_OFFICE, PERMIT_NUMBER, APPROVER_TITLE, ACTION,
  LAST_DATE_TO_OBJECTION, TOTAL_TREES, REASON_SHORT,
  PLACE, STREET, START_DATE,
  TREES_PER_PERMIT, PERSON_REQUEST_NAME, TREE_PERMIT_URL,
} = require('../../model/tree_permit_constants');
const { formatDate, figureStartDate } = require('./utils');
const Log = require('../log');

const STREET_NAME = 'שם הרחוב';
const OBJECTION_TILL = 'הגשת ערעור עד תאריך';
const TREE_NUM = 'כמות עצים';
const TREE_TYPE = 'סוג העצים';
const LICENSE_OWNER = 'שם בעל הרישיון';
const LICENSE_REASON = 'סיבה';
const YAVNE_CITY = 'יבנה';
const SHORT_ACTION = 'כריתה/העתקה';
const APPROVER = 'פקיד יערות עירוני יבנה';
const HOUR_PERMIT = '09:00'; 
const DATE_FORMAT_PERMIT = 'DD/MM/YY';

const TREES_YAVNE_URL = Config.get('trees.yavneUrl');
const yavneTreePermit = {
  urls: [TREES_YAVNE_URL]
};

async function parseTreesHtml(url) {
    const response = await axios.request({
        method: 'GET',
        url: TREES_YAVNE_URL,
        responseType: 'arraybuffer',
        responseEncoding: 'binary'
      });

  const treesHtml = iconv.decode(response.data, 'win1255');

  const dom = cheerio.load(treesHtml, {
    decodeEntities: false
  });
  if (!dom) {
    console.error('cheerio dom is null');
  }
  const keys = [];
  const result = [];
  dom('.tablePageFormat').find('table').find('tr').each((row, elem) => {
    if (row === 0) {
      dom(elem).find('td,th').each((idx, elem) => {
        const key = dom(elem).text().trim();
        keys.push(key);
      });
      return;
    }
    const treePermit = {};
    dom(elem).find('td,th').each((idx, elem) => {
      const value = dom(elem).text().trim();
      const key = keys[idx];
      treePermit[key] = value;
    });
    result.push(treePermit);
  });
  Log.info(`number of yavne permits: ${result.length}`);
  return result;
}

function processRawPermits(rawPermits) {
  try {
    const treePermits = rawPermits.map(raw => {
      try{        
        const last_date_to_objection = formatDate(raw[OBJECTION_TILL], HOUR_PERMIT, DATE_FORMAT_PERMIT);
        if (!last_date_to_objection) {
          Log.error(`No / Bad dates format, ignore this license: yavne, ${raw[STREET_NAME]} , ${raw[OBJECTION_TILL]}`);
          return null;
        }
        
        const treesPerPermit = parseTreesPerPermit(raw[TREE_TYPE], raw[TREE_NUM]);
        const totalTrees = parseInt(raw[TREE_NUM]);
        
        const permitNumber = `meirim-yavne-${raw[STREET_NAME]}-${last_date_to_objection}`;

        const attributes = {
          [REGIONAL_OFFICE]: YAVNE_CITY,
          [PLACE]: YAVNE_CITY,
          [APPROVER_TITLE]: APPROVER,
          [PERMIT_NUMBER]: permitNumber,
          [STREET]: raw[STREET_NAME],
          [ACTION]: raw[SHORT_ACTION],
          [LAST_DATE_TO_OBJECTION]: last_date_to_objection,
          [START_DATE]: figureStartDate(null, raw[OBJECTION_TILL], HOUR_PERMIT, DATE_FORMAT_PERMIT, true),
          [PERSON_REQUEST_NAME]: raw[LICENSE_OWNER],
          [REASON_SHORT]: raw[LICENSE_REASON],
          [TREES_PER_PERMIT]: treesPerPermit,
          [TOTAL_TREES]: totalTrees,
          [TREE_PERMIT_URL]: TREES_YAVNE_URL,
        };
        const permit = new TreePermit(attributes);
        return permit;
      }
      catch (e) {
        Log.error(`error in yavne parse row, ignoring: ${raw[STREET_NAME]}`, e.message);
        return null;
      }
    }
    );
    return treePermits.filter(Boolean); // remove undefined values;
  }
  catch (e) {
    Log.error('error in yavne parse rows:' + e);
  }
}

function parseTreesPerPermit(treesInPermitStr, totalTrees) {
  var result = {};
  result[0] = {[treesInPermitStr] : totalTrees};
  return Object.assign({}, ...Object.values(result));
}

/**
 * Scrape yavne Tree page, and return the results as a TreePermit[].
 */
async function crawlYavneTreesHTML(url, permitType) {
  try {
    const raw = await parseTreesHtml(url);
    const treePermits = processRawPermits(raw);
    return treePermits;
  }
  catch (e) {
    Log.error(e.message);
  }
}

module.exports = { crawlYavneTreesHTML, yavneTreePermit };
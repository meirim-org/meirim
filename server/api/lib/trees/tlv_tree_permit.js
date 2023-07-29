const proxy = require('./../proxy');
const cheerio = require('cheerio');
const Config = require('../../lib/config');
const TreePermit = require('../../model/tree_permit');
const {
	REGIONAL_OFFICE, PERMIT_NUMBER, APPROVER_TITLE, ACTION,
	LAST_DATE_TO_OBJECTION, TOTAL_TREES,
	PLACE, STREET, START_DATE,
	TREES_PER_PERMIT, PERSON_REQUEST_NAME, TREE_PERMIT_URL,
	GUSH, HELKA, REASON_DETAILED, APPROVER_NAME
} = require('../../model/tree_permit_constants');
const { formatDate, figureStartDate } = require('./utils');
const Log = require('../log');

const STREET_NAME = 'שם הרחוב';
const OBJECTION_TILL = 'תאריך אחרון להגשת התנגדויות:';
const TREE_NUM = 'כמות העצים:';
const TREE_TYPE =  'מין העץ:';
const LICENSE_NUMBER = 'מספר רישיון';
const LICENSE_OWNER = 'שם בעל הרישיון';
const LICENSE_REASON = 'סיבה:';
const LICENSE_APPROVER_TITLE = 'פקיד יערות עירוני תל אביב-יפו';
const TEL_AVIV_CITY = 'תל אביב-יפו';
const SHORT_ACTION = 'כריתה';
const APPROVER = 'שם פקיד היערות המאשר:';
const HOUR_PERMIT = '09:00';
const DATE_FORMAT_PERMIT = 'DD/MM/YYYY';
const PERMIT_GUSH = 'גוש:';
const PERMIT_HELKA = 'חלקה:';

const TREES_TEL_AVIV_URL = Config.get('trees.tlvUrl');
const tlvTreePermit = {
	urls: [TREES_TEL_AVIV_URL]
};

async function parseTreesHtml(url) {
	const treesHtml = await proxy.get(url);
	const dom = cheerio.load(treesHtml, {
		decodeEntities: false
	});
	if (!dom) {
		console.error('cheerio dom is null');
	}
	const result = [];

	const rawRows = dom('.table-scrl').find('tr');
	//ignore row 0
	for (let i = 1; i < rawRows.length; i = i+2) {
		const permit = {};
		permit.permitNumber = dom(rawRows[i]).attr('title');
		dom(rawRows[i]).find('td').each((idx,elem) => {				
			const val = dom(elem).text().trim();
			if (idx == 0) {
				permit[LICENSE_NUMBER] = val;
			}
			if (idx == 1) {
				permit[STREET_NAME] = val;
			}
			if (idx == 2) {
				permit[ACTION] = val;
			}   
		});


		dom(rawRows[i+1]).find('td > div > div').each((idx,elem) => {				
			const key = dom(elem).find('div h5').text().trim();
			const value = dom(elem).find('div span').text().trim();
			permit[key] = value;     
		});

		console.log(`tree permit tlv: ${Object.entries(permit)}`);
		result.push(permit);
	}
	Log.info(`number of Tel Aviv permits: ${result.length}`);
	return result;
}

function processRawPermits(rawPermits) {
	try {
		const treePermits = rawPermits.map(raw => {
			try {
				const last_date_to_objection = formatDate(raw[OBJECTION_TILL], HOUR_PERMIT, DATE_FORMAT_PERMIT);
				if (!last_date_to_objection) {
					Log.error(`No / Bad dates format, ignore this license: tel aviv, ${raw[STREET_NAME]} , ${raw[OBJECTION_TILL]}`);
					return null;
				}

				const treesPerPermit = parseTreesPerPermit(raw[TREE_TYPE], raw[TREE_NUM]);
				const totalTrees = sum(treesPerPermit);

				const attributes = {
					[REGIONAL_OFFICE]: TEL_AVIV_CITY,
					[PLACE]: TEL_AVIV_CITY,
					[APPROVER_NAME]: raw[APPROVER],
					[APPROVER_TITLE]: LICENSE_APPROVER_TITLE,
					[PERMIT_NUMBER]: raw[LICENSE_NUMBER],
					[STREET]: raw[STREET_NAME],
					[GUSH]: raw[PERMIT_GUSH],
					[HELKA]: raw[PERMIT_HELKA],
					[ACTION]: SHORT_ACTION,
					[LAST_DATE_TO_OBJECTION]: last_date_to_objection,
					[START_DATE]: figureStartDate(null, raw[OBJECTION_TILL], HOUR_PERMIT, DATE_FORMAT_PERMIT, true),
					[PERSON_REQUEST_NAME]: raw[LICENSE_OWNER],
					[REASON_DETAILED]: raw[LICENSE_REASON],
					[TREES_PER_PERMIT]: treesPerPermit,
					[TOTAL_TREES]: totalTrees,

					[TREE_PERMIT_URL]: TREES_TEL_AVIV_URL,
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
	const linesName = getCleanLines(treesInPermitStr);
	const linesAmount = getCleanLines(treeAmount);
	var result = {};
	for (let i = 0; i < linesName.length; ++i) {
		result[i] = { [linesName[i]]: parseInt(linesAmount[i] || '0') };
	}
	return Object.assign({}, ...Object.values(result));
}

function getCleanLines(str) {
	str = replaceAll(str, '\t', '');
	str = replaceAll(str, '\n\n', '\n');
	return str.split('\n');
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
async function crawlTLVTrees(url, permitType) {
	try {
		const raw = await parseTreesHtml(url);
		const treePermits = processRawPermits(raw);
		return treePermits;
	}
	catch (e) {
		Log.error(e.message);
	}
}

module.exports = { crawlTLVTrees, tlvTreePermit: tlvTreePermit };
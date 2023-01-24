const proxy = require('./../proxy');
const cheerio = require('cheerio');
const TreePermit = require('../../model/tree_permit');
const {
	REGIONAL_OFFICE, START_DATE, PERMIT_NUMBER, APPROVER_TITLE, ACTION, 
	END_DATE, LAST_DATE_TO_OBJECTION, TOTAL_TREES, REASON_DETAILED,
	GUSH, HELKA, PLACE, STREET,
	TREES_PER_PERMIT, PERMIT_ISSUE_DATE, TREE_PERMIT,
} = require('../../model/tree_permit_constants');
const { formatDate } = require('./utils');
const Log = require('../log');

const TREES_JERUSALEM_URL = 'https://www.jerusalem.muni.il/he/residents/environment/improvingcity/trees-conservation/';
const JERTreePermit = {
	urls:[TREES_JERUSALEM_URL]
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
	dom('.table').find('tr').each((row, elem) => {
		if (row === 0) {
			dom(elem).find('th').each((idx, elem) => {
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
	Log.info(`number of jerusalem permits: ${result.length}`);
	return result;
}

function processRawPermits(rawPermits) {
	try {
		const treePermits = rawPermits.map(raw => {
			const actionDirty = raw['שם רחוב'].match(/\(.*\)/g)[0]; // captures (כריתה), (העתקה)
			const street = raw['שם רחוב'].slice(0, raw['שם רחוב'].indexOf(actionDirty));
			const action = actionDirty.replace('(', '').replace(')', '');
			const last_date_to_objection = parsePermitDates(raw['ניתן להגיש ערר עד ליום'])[0];
			const gushHelka =  parseGushHelka(raw['גוש / חלקה']);
			const gush = gushHelka[0] ? gushHelka[0] : '';
			const helka = gushHelka[1] ? gushHelka[1] : '';
			const treesPerPermit = parseTreesPerPermit(raw['מספר עצים/סוג עץ']);
			const totalTrees = sum(Object.values(treesPerPermit));
			const dates = parsePermitDates(raw['תאריך הוצאת הרשיון - תוקף הרשיון']);
			const permitNumber = `meirim-jer-${street}-${dates[0]}`;
			
			const attributes = {
				[REGIONAL_OFFICE]: 'ירושלים',
				[PLACE]: 'ירושלים',
				[APPROVER_TITLE]: 'פקיד יערות עירוני ירושלים',
				[PERMIT_NUMBER]: permitNumber,
				[STREET]: street,
				[ACTION]: action,
				[LAST_DATE_TO_OBJECTION]: last_date_to_objection,
				[GUSH]: gush,
				[HELKA]: helka,
				[REASON_DETAILED]: raw['סיבת העקירה / העתקה'],
				[TREES_PER_PERMIT]: treesPerPermit,
				[TOTAL_TREES]: totalTrees,
				[PERMIT_ISSUE_DATE]: dates[0],
				[START_DATE]: dates[1],
				[END_DATE]: dates[2],
				[TREE_PERMIT]: 'https://www.jerusalem.muni.il/he/residents/environment/improvingcity/trees-conservation/',
			};
			const permit = new TreePermit(attributes);
			return permit;
		});
		return treePermits;
	}
	catch (e) {
		Log.error('error in jerusalem parse rows:' + e);
	}
}

function parseTreesPerPermit(treesInPermitStr) {
	const lines = treesInPermitStr.split('\n');
	const treesInPermit = lines.map(line => {
		const treeItem = line.split('-');
		return {
			[treeItem[0]]: treeItem[1] || 0,
		};
	});
	return Object.assign({}, ...treesInPermit);
}

function parseGushHelka(gushHelkaStr) {
	return gushHelkaStr? gushHelkaStr.split('\n'): [];
}

function parsePermitDates(treeDatesStr) {
	const dates = treeDatesStr.split('\n');
	return dates.map(date => formatDate(date,'09:00', 'DD.MM.YYYY' ));
}

function sum(treeArray) {
	const amount = treeArray.map( (item) => { return parseInt((item)) || 0; });
	return amount.reduce((total, current) => {
		return total + current;
	});
}
/**
 * Scrape Jerusalem Tree page, and return the results as a TreePermit[].
 * An input example could be found in server/tests/jerusalem_trees_example.js
 */
async function crawlTreesHTML(url, permitType ) {
	const raw = await parseTreesHtml(url);
	const treePermits = processRawPermits(raw);
	return treePermits;
}

module.exports = { crawlTreesHTML, JERTreePermit };




const Log = require('../../log');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const fetch = require('node-fetch');
const moment = require('moment');

const TreePermit = require('../../../model/tree_permit');
const tpc = require('../../../model/tree_permit_constants');
const database = require('../../../service/database');

// const REGIONAL_TREES_URL = 'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Pages/default.aspx';
const RAW_DATA_FOLDER =  require('os').homedir() + '/raw_trees';
const REGIONAL_OFFICE_URL_BEFORE_DEADLINE = [
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_galil_golan.XLS'
];

async function getRegionalTreePermitsFromFile(url, pathname) {
	try {
		console.log('Fetching trees file... ' + `${url}`);

		const res = await fetch(url);	
		return new Promise((resolve) => {
			const stream = fs.createWriteStream(pathname);
			stream.on('open', () => {
				res.body.pipe(stream);
			});
			stream.on('finish', async function () {
				stream.close();
			
				console.log(`Sucessfully Downloaded trees file: ${url}
				 File Could be found here: ${pathname}`);

				const tree_permits = await parseTreesXLS(pathname);
				resolve(tree_permits);
			});
		});
	}
	catch (err) {
		console.log(err);
	}
}

async function saveNewTreePermits(tree_permits) {	
	// tree permits are published for objecctions for a period of 2 weeks. taking a 12 months
	// buffer should be enough for human to remove those lines from the excel sheet.
	//We're reading a the rows as a bulk and match them at compute time for performance.

	//compare to existing tree list in db by region
	console.log('Save new tree permits...');
	if (tree_permits.length == 0) return [];
	// all tree permits in a chunk should be from the same regional office
	const regional_office = tree_permits[0].attributes[tpc.REGIONAL_OFFICE];
	// this is the only timestamp format knex correcrtly work with 
	const time_ago = moment().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ssZ'); 
	const existing_permits_compact = new Set();
	await database.Knex(tpc.TREE_PERMIT_TABLE).where( 'updated_at', '>' ,time_ago.toString())
		.andWhere(tpc.REGIONAL_OFFICE, regional_office)
		.then(rows => {
			for (let row of rows) {
				const key_as_string = 
				[
					row[tpc.PERMIT_NUMBER],
					row[tpc.TREE_NAME],
					row[tpc.NUMBER_OF_TREES],
					row[tpc.END_DATE]
				].join('_');
				existing_permits_compact.add(key_as_string);
			}
		})
		.catch(function(error) { console.error(error); });

	const new_tree_permits = tree_permits.map(tp => {
		//if tp is not in the hash map of the existing one - add to the new ones
		const compact_tp = 
		[
			tp.attributes[tpc.PERMIT_NUMBER],
			tp.attributes[tpc.TREE_NAME],
			tp.attributes[tpc.NUMBER_OF_TREES],
			tp.attributes[tpc.END_DATE]
		].join('_');

		if (existing_permits_compact.has(compact_tp)) {
			console.log('Already has ' + compact_tp);
		}
		else {
			console.log(`A new one! queued for saving ${compact_tp}`);
			return tp; //original one, not compact
		}
	}).filter(Boolean) ; // remove undefined values
	//save only the new ones
	try {
		new_tree_permits.map(tp => {
			console.log(`
			saving new tree permit: ${tp.attributes[tpc.PERMIT_NUMBER]} with ${tp.attributes[tpc.NUMBER_OF_TREES]} ${tp.attributes[tpc.TREE_NAME]} trees.`);
			tp.save();
		});
	}
	catch (err){
		console.log(err);
	}
	return new_tree_permits;
}

const parseTreesXLS = async (filename) => {
	const workbook = xlsx.readFile(filename);
	const sheet = workbook.Sheets['Data2ToExcel_BeforDate'];
	const trees_csv = xlsx.utils.sheet_to_csv(sheet, {FS: '|'});

	const rows = trees_csv.split('\n');
	const headers = rows[0].split('|');
	//slice - ignore the header and the empty line at the end, caused by the conversion to csv
	const tree_permits =rows.slice(1,-1).map((row) => {
		row= row.split('|');
		return new TreePermit(
			{
				[tpc.REGIONAL_OFFICE]: row[headers.indexOf('אזור')],
				[tpc.PERMIT_NUMBER]: row[headers.indexOf('מספר רשיון')],
				[tpc.ACTION]: row[headers.indexOf('פעולה')], // cutting , copying
				[tpc.PERMIT_ISSUE_DATE]: row[headers.indexOf('תאריך הרשיון')],
				[tpc.PERSON_REQUEST_NAME]: row[headers.indexOf('מבקש')],
				[tpc.START_DATE]: row[headers.indexOf('מתאריך')],
				[tpc.END_DATE]: row[headers.indexOf('עד תאריך')],
				[tpc.LAST_DATE_TO_OBJECTION]: row[headers.indexOf('תאריך אחרון להגשת ערער')], // column might be missing from
				[tpc.APPROVER_NAME]: row[headers.indexOf('שם מאשר')],
				[tpc.APPROVER_TITLE]: row[headers.indexOf('תפיד מאשר')],
				// Location
				[tpc.PLACE]: row[headers.indexOf('מקום הפעולה')],
				[tpc.STREET]: row[headers.indexOf('רחוב')],
				[tpc.STREET_NUMBER]: row[headers.indexOf('מספר')],
				[tpc.GUSH]: row[headers.indexOf('גוש')],
				[tpc.HELKA]: row[headers.indexOf('חלקה')],
				// Trees details
				[tpc.TREE_NAME]: row[headers.indexOf('שם העץ')],
				[tpc.TREE_KIND]: row[headers.indexOf('סוג העץ')],
				[tpc.NUMBER_OF_TREES]: row[headers.indexOf('מספר עצים')],
				[tpc.REASON_SHORT]: row[headers.indexOf('סיבה')],
				[tpc.REASON_DETAILED]: row[headers.indexOf('פרטי הסיבה')],
				[tpc.COMMENTS_IN_DOC]: row[headers.indexOf('הערות לעצים')]
			}			
		);
	});
	return tree_permits;
};

module.exports = {
	crawlRegionalTreePermit: crawlRegionalTreePermit,
};

function generateFilenameByTime(url) {
	const parsedFile = path.parse(url);
	const basename = parsedFile.name.toLowerCase() + '-' + moment().format('YYYY-MM-DD-hh-mm-ss') + parsedFile.ext.toLowerCase();
	const filename = path.resolve(RAW_DATA_FOLDER, basename);
	return filename;
}

async function crawlRegionalTreePermit(url){ 
	const filename = generateFilenameByTime(url);
	const tree_permits = await getRegionalTreePermitsFromFile(url, filename);
	const new_tree_permits = await saveNewTreePermits(tree_permits);
	console.log('Extracted ' + new_tree_permits.length +' new permits from: ' + filename );
}
crawlRegionalTreePermit(REGIONAL_OFFICE_URL_BEFORE_DEADLINE[0]);

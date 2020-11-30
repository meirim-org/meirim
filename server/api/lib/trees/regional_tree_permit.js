//const Log = require('../../log');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const fetch = require('node-fetch');
const moment = require('moment');
//const wtf = require('wtfnode');
const AbortController = require('abort-controller');

const TreePermit = require('../../model/tree_permit');
const tpc = require('../../model/tree_permit_constants');
const database = require('../../service/database');

// Regional tree permits were taken from here: 'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Pages/default.aspx';
const RAW_DATA_FOLDER = require('os').homedir() + '/raw_trees';
const regionalTreePermitUrls = [
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_galil_golan.XLS',
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_galil_golan.XLS',

	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_amakim_galil_gilboa.XLS',
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_amakim_galil_gilboa.XLS',

	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/befor_merkaz-sharon.XLS',
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_merkaz-sharon.XLS',

	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_merkaz_shfela.XLS',
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_merkaz_shfela.XLS',

	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_jerusalem.XLS',
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_jerusalem.XLS',

	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/Befor_darom.XLS',
	//'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_darom.XLS', - no after darom

];

const SHEET_BEFORE = 'Data2ToExcel_BeforDate';
const SHEET_AFTER = 'Data2ToExcel_ToDate';
const TIMEOUT_MS = 5000;

async function getRegionalTreePermitsFromFile(url, pathname) {
	try {
		const controller = new AbortController();
		const controllerTimeout = setTimeout(
			() => { controller.abort(); },
			TIMEOUT_MS,
		);
		console.log('Fetching trees file... ' + `${url}`);
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const res = await fetch(url, { signal: controller.signal });
					const stream = fs.createWriteStream(pathname);
					stream.on('open', () => {
						res.body.pipe(stream);
					});
					stream.on('finish', async function () {
						stream.close();
						console.log(`Sucessfully Downloaded trees file: ${url}
				 File Could be found here: ${pathname}`);

						const treePermits = await parseTreesXLS(pathname);
						resolve(treePermits);
					});
				}
				catch (err) {
					console.log(`Error fetching file ${url} :  ${err}`);
					reject(err);
				}
				finally {
					() => { clearTimeout(controllerTimeout); };
				}
			})();
		});

	}
	catch (err) {
		console.log(err);
		return Promise.resolve(); // TODO reject
	}
}

async function saveNewTreePermits(treePermits) {
	// tree permits are published for objecctions for a period of 2 weeks. taking a 12 months
	// buffer should be enough for human to remove those lines from the excel sheet.
	//We're reading a the rows as a bulk and match them at compute time for performance.

	if (treePermits.length == 0) return [];
	// all tree permits in a chunk should be from the same regional office
	const regional_office = treePermits[0].attributes[tpc.REGIONAL_OFFICE];
	// this is the only timestamp format knex correcrtly work with 
	const time_ago = moment().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ssZ');
	const existing_permits_compact = new Set();
	await database.Knex(tpc.TREE_PERMIT_TABLE).where('updated_at', '>', time_ago.toString())
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
		.catch(function (error) { console.error(error); });

	const new_tree_permits = treePermits.map(tp => {
		//if tp is not in the hash map of the existing one - add to the new ones
		const compact_tp =
			[
				tp.attributes[tpc.PERMIT_NUMBER],
				tp.attributes[tpc.TREE_NAME],
				tp.attributes[tpc.NUMBER_OF_TREES],
				tp.attributes[tpc.END_DATE]
			].join('_');

		if (tp.attributes[tpc.REGIONAL_OFFICE] == regional_office && !existing_permits_compact.has(compact_tp)) {
			console.log(`A new one! queued for saving ${compact_tp}`);
			return tp; //original one, not compact
		}
	}).filter(Boolean); // remove undefined values
	//save only the new ones
	try { //TODO promise all or knex save bulk
		new_tree_permits.map(async tp => {
			console.log(`saving new tree permit: ${tp.attributes[tpc.PERMIT_NUMBER]} with ${tp.attributes[tpc.NUMBER_OF_TREES]} ${tp.attributes[tpc.TREE_NAME]} trees.`);
			await tp.save();
		});
	}
	catch (err) {
		console.log(err);
	}
	return new_tree_permits;
}

const parseTreesXLS = async (filename) => {
	// hack
	const sheetname = path.parse(filename).name.toLowerCase().includes('after') ? SHEET_AFTER : SHEET_BEFORE;
	const workbook = xlsx.readFile(filename);
	const sheet = workbook.Sheets[sheetname];
	const sheet_json = xlsx.utils.sheet_to_json(sheet, { raw: false });
	const treePermits = sheet_json.map(row => {
		return new TreePermit(
			{
				[tpc.REGIONAL_OFFICE]: row['אזור'],
				[tpc.PERMIT_NUMBER]: row['מספר רשיון'],
				[tpc.ACTION]: row['פעולה'], // cutting , copying
				[tpc.PERMIT_ISSUE_DATE]: row['תאריך הרשיון'],
				[tpc.PERSON_REQUEST_NAME]: row['מבקש'],
				[tpc.START_DATE]: row['מתאריך'],
				[tpc.END_DATE]: row['עד תאריך'],
				[tpc.LAST_DATE_TO_OBJECTION]: row['תאריך אחרון להגשת ערער'], // column might be missing from
				[tpc.APPROVER_NAME]: row['שם מאשר'],
				[tpc.APPROVER_TITLE]: row['תפיד מאשר'],
				// Location
				[tpc.PLACE]: row['מקום הפעולה'],
				[tpc.STREET]: row['רחוב'],
				[tpc.STREET_NUMBER]: row['מספר'],
				[tpc.GUSH]: row['גוש'],
				[tpc.HELKA]: row['חלקה'],
				// Trees details
				[tpc.TREE_NAME]: row['שם העץ'],
				[tpc.TREE_KIND]: row['סוג העץ'],
				[tpc.NUMBER_OF_TREES]: row['מספר עצים'],
				[tpc.REASON_SHORT]: row['סיבה'],
				[tpc.REASON_DETAILED]: row['פרטי הסיבה'],
				[tpc.COMMENTS_IN_DOC]: row['הערות לעצים']
			}
		);
	});
	return treePermits;
};

function generateFilenameByTime(url) {
	const parsedFile = path.parse(url);
	const basename = parsedFile.name.toLowerCase() + '-' + moment().format('YYYY-MM-DD-hh-mm-ss') + parsedFile.ext.toLowerCase();
	const filename = path.resolve(RAW_DATA_FOLDER, basename);
	return filename;
}

async function crawlRegionalTreePermit(url) {
	try {
		const filename = generateFilenameByTime(url);
		const treePermits = await getRegionalTreePermitsFromFile(url, filename);
		const newTreePermits = await saveNewTreePermits(treePermits);
		console.log('Extracted ' + newTreePermits.length + ' new permits from: ' + filename);
		return newTreePermits.length;
	} catch (err) {
		console.log(err);
		return false;
	}
}
const regionalTreePermit = () => {
	Promise.allSettled(regionalTreePermitUrls.map(url => crawlRegionalTreePermit(url)))
		.then((results) => {
			let sumNewPermits = 0;
			results.forEach(element => {
				sumNewPermits = sumNewPermits + element.value;
			});
			console.log(`Done! Total ${sumNewPermits} new permits`);
		})
		.catch(err => console.log(err))
		.finally(() => process.exit());
};

module.exports = {
	regionalTreePermit
};
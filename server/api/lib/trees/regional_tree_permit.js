const Log = require('../log');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const fetch = require('node-fetch');
const moment = require('moment');
const AbortController = require('abort-controller');
const aws = require('aws-sdk');

const TreePermit = require('../../model/tree_permit');
const tpc = require('../../model/tree_permit_constants');
const database = require('../../service/database');
const Config = require('../../lib/config');

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

const bucketName = Config.get('aws.treeBucketName');
const useS3 = Config.get('aws.useS3ForTreeFiles');

async function getRegionalTreePermitsFromFile(url, pathname) {
	try {
		const controller = new AbortController();
		const controllerTimeout = setTimeout(
			() => { controller.abort(); },
			TIMEOUT_MS,
		);
		Log.info('Fetching trees file... ' + `${url}`);
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
						Log.info(`Sucessfully Downloaded trees file: ${url}
				 File Could be found here: ${pathname}`);

						const treePermits = await parseTreesXLS(pathname);
						resolve(treePermits);
					});
				}
				catch (err) {
					Log.error(`Error fetching file ${url} :  ${err}`);
					reject(err);
				}
				finally {
					() => { clearTimeout(controllerTimeout); };
				}
			})();
		});
	}
	catch (err) {
		Log.error(err);
		return Promise.reject();
	}
}

async function saveNewTreePermits(treePermits) {
	// Tree permits are published for objecctions for a period of 2 weeks. taking a 12 months
	// buffer should be enough for human to remove those lines from the excel sheet.
	//We're reading a the rows as a bulk and match them at compute time for performance.

	if (treePermits.length == 0) return [];
	// all tree permits in a chunk should be from the same regional office
	const regionalOffice = treePermits[0].attributes[tpc.REGIONAL_OFFICE];
	// this is the only timestamp format knex correcrtly work with 
	const time_ago = moment().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ssZ');
	const existingPermitsCompact = new Set();
	await database.Knex(tpc.TREE_PERMIT_TABLE).where('updated_at', '>', time_ago.toString())
		.andWhere(tpc.REGIONAL_OFFICE, regionalOffice)
		.then(rows => {
			for (let row of rows) {
				const key_as_string =
					[
						row[tpc.PERMIT_NUMBER],
						row[tpc.TREE_NAME],
						row[tpc.NUMBER_OF_TREES],
						row[tpc.END_DATE]
					].join('_');
				existingPermitsCompact.add(key_as_string);
			}
		})
		.catch(function (error) { Log.error(error); });

	const new_tree_permits = treePermits.map(tp => {
		//if tp is not in the hash map of the existing one - add to the new ones
		const compact_tp =
			[
				tp.attributes[tpc.PERMIT_NUMBER],
				tp.attributes[tpc.TREE_NAME],
				tp.attributes[tpc.NUMBER_OF_TREES],
				tp.attributes[tpc.END_DATE]
			].join('_');

		if (tp.attributes[tpc.REGIONAL_OFFICE] == regionalOffice && !existingPermitsCompact.has(compact_tp)) {
			Log.debug(`A new one! queued for saving ${compact_tp}`);
			return tp; //original one, not compact
		}
	}).filter(Boolean); // remove undefined values
	//save only the new ones
	try { //TODO promise all or knex save bulk
		new_tree_permits.map(async tp => {
			Log.info(`Saving new tree permit: ${tp.attributes[tpc.PERMIT_NUMBER]} with ${tp.attributes[tpc.NUMBER_OF_TREES]} ${tp.attributes[tpc.TREE_NAME]} trees.`);
			await tp.save();
		});
	}
	catch (err) {
		Log.error(err);
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
	const filenameNoDate = parsedFile.base;
	const filenameWithDate = parsedFile.name.toLowerCase() + '-' + moment().format('YYYY-MM-DD-hh-mm-ss') + parsedFile.ext.toLowerCase();
	const localFilename = path.resolve(RAW_DATA_FOLDER, filenameNoDate);
	return {s3filename: filenameWithDate, localFilename: localFilename};
}

async function crawlRegionalTreePermit(url) {
	try {
		const {s3filename, localFilename} = generateFilenameByTime(url);
		const treePermits = await getRegionalTreePermitsFromFile(url, localFilename);
		const newTreePermits = await saveNewTreePermits(treePermits);
		Log.info('Extracted ' + newTreePermits.length + ' new permits from: ' + s3filename);
		if (useS3){
			await uploadToS3(s3filename, localFilename);	
		}
		return newTreePermits.length;
	} catch (err) {
		Log.error(err);
		return false;
	}
}
const regionalTreePermit = () => {
	return new Promise((resolve, reject) => {
		Promise.allSettled(regionalTreePermitUrls.map(url => crawlRegionalTreePermit(url)))
			.then((results) => {
				let sumNewPermits = 0;
				results.forEach(element => {
					sumNewPermits = sumNewPermits + element.value;
				});
				Log.info(`Done! Total ${sumNewPermits} new permits`);
				resolve(sumNewPermits);
			})
			.catch(err => {
				Log.error(err);
				reject(err);
			});
	});
};

async function uploadToS3(filename, fullFileName) {
	const fileStream = fs.createReadStream(fullFileName);
	fileStream.on('error', function (err) {
		Log.error('File Error', err);
	});
	const keyName = 'regional/' + filename;
	const objectParams = { Bucket: bucketName, Key: keyName, Body: fileStream };
	const res = await new aws.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
	Log.info(`Successfully Uploaded to ${bucketName}/${keyName}. Status code: ${res.$response.statusCode}`);
}

module.exports = {
	regionalTreePermit
};

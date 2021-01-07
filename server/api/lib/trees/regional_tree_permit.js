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
const Geocoder = require('../../service/tree_geocoder').geocoder;

// Regional tree permits were taken from here: 'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Pages/default.aspx';
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
const MORNING = '08:00';
const EVENING = '20:00';

const { treeBucketName: bucketName, useS3ForTreeFiles: useS3 } = Config.get('aws');
const treesRawDataDir = path.resolve(Config.get('trees.rawDataDir'));
const GEO_CODING_INTERVAL = Config.get('trees.geoCodingInterval');

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
						Log.info(`Successfully Downloaded trees file: ${url}. File Could be found here: ${pathname}`);

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
			rows.map(row => {
				const key_as_string = `${row[tpc.REGIONAL_OFFICE]}_${row[tpc.PERMIT_NUMBER]}_${formatDate(row[tpc.START_DATE], MORNING)}`;
				existingPermitsCompact.add(key_as_string);
			});
		})
		.catch(function (error) { Log.error(error); });

	const new_tree_permits = treePermits.map(tp => {
		//if tp is not in the hash map of the existing one - add to the new ones
		const compact_tp = `${tp.attributes[tpc.REGIONAL_OFFICE]}_${tp.attributes[tpc.PERMIT_NUMBER]}_${formatDate(tp.attributes[tpc.START_DATE], MORNING)}`;
		if (tp.attributes[tpc.REGIONAL_OFFICE] == regionalOffice && !existingPermitsCompact.has(compact_tp)) {
			Log.debug(`A new tree liecence! queued for saving ${compact_tp}`);
			return tp; //original one, not compact
		}
	}).filter(Boolean); // remove undefined values
	//save only the new ones
	try { //TODO promise all or knex save bulk
		new_tree_permits.map(async tp => {
			setTimeout(async tp => {
				const polygonFromPoint = await generateGeomFromAddress(tp.attributes[tpc.PLACE],tp.attributes[tpc.street]);
				tp.attributes[tpc.GEOM] = polygonFromPoint;
				Log.info(`Saving new tree permit: ${tp.attributes[tpc.REGIONAL_OFFICE]} ${tp.attributes[tpc.PERMIT_NUMBER]} with ${tp.attributes[tpc.TOTAL_TREES]} trees.`);
				await tp.save();
			
			}, GEO_CODING_INTERVAL,tp); // max rate to query nominatim is 1 request per second
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
	const rawTreePermits = sheet_json.map(row => {

		try {
			return {
				'core': {
					[tpc.REGIONAL_OFFICE]: row['אזור'],
					[tpc.PERMIT_NUMBER]: row['מספר רשיון'],
					[tpc.ACTION]: row['פעולה'], // cutting , copying
					[tpc.PERMIT_ISSUE_DATE]: formatDate(row['תאריך הרשיון'], MORNING),
					[tpc.PERSON_REQUEST_NAME]: row['מבקש'],
					[tpc.START_DATE]: formatDate(row['מתאריך'], MORNING),
					[tpc.END_DATE]: formatDate(row['עד תאריך'], EVENING),
					[tpc.LAST_DATE_TO_OBJECTION]: row['תאריך אחרון להגשת ערער'] ? formatDate(row['תאריך אחרון להגשת ערער'], MORNING) : undefined, // column might be missing from
					[tpc.APPROVER_NAME]: row['שם מאשר'],
					[tpc.APPROVER_TITLE]: row['תפיד מאשר'],
					// Location
					[tpc.PLACE]: row['מקום הפעולה'],
					[tpc.STREET]: row['רחוב'],
					[tpc.STREET_NUMBER]: row['מספר'],
					[tpc.GUSH]: row['גוש'],
					[tpc.HELKA]: row['חלקה'],

					[tpc.REASON_SHORT]: row['סיבה'],
					[tpc.REASON_DETAILED]: row['פרטי הסיבה'],
					[tpc.COMMENTS_IN_DOC]: row['הערות לעצים']	
				},
				'extra': {
					[tpc.TREE_NAME]: row['שם העץ'],
					[tpc.NUMBER_OF_TREES]: row['מספר עצים'],
				}
			};
		}
		catch (err) {
			Log.error(`Error reading line ${row['מספר רשיון']}-${row['שם העץ']} from file ${filename}`);
			Log.error(err);
		}
	});
	return processPermits(rawTreePermits);
};

async function generateGeomFromAddress(place, street) {
	const address = (place && street) ?
		`${place} ${street}` : `${place}`;

	const res = await Geocoder.geocode(address);
	if (!res[0]) {
		Log.error(`Couldn't geocode address: ${address}. return`);
		return;
	}
	Log.debug(`address ${address} : ${res[0].longitude},${res[0].latitude} `);
	const polygonFromPoint = JSON.parse(`{ "type": "Polygon", "coordinates": [[ [ ${res[0].longitude}, ${res[0].latitude}],[ ${res[0].longitude}, ${res[0].latitude}],[ ${res[0].longitude}, ${res[0].latitude}],[ ${res[0].longitude}, ${res[0].latitude}]  ]] }`);
	return polygonFromPoint;
}

function processPermits(rawTreePermits) {
	// Migrate all rows of each tree permit into one line: address, dates etc.
	// Add sum of all trees in the permit
	// Keep the details per tree kind / number of trees into a tree table
	const treePermits = {};
	rawTreePermits.map(rtp => {
		const key = `${rtp.core[tpc.REGIONAL_OFFICE]}_${rtp.core[tpc.PERMIT_NUMBER]}_${rtp.core[tpc.START_DATE]}}`;
		if (treePermits[key] && treePermits[key].attributes[tpc.TOTAL_TREES]) { //exist
			treePermits[key].attributes[tpc.TOTAL_TREES] = treePermits[key].attributes[tpc.TOTAL_TREES] + Number(rtp.extra[tpc.NUMBER_OF_TREES]);
			treePermits[key].attributes[tpc.TREES_PER_PERMIT] = { ...treePermits[key].attributes[tpc.TREES_PER_PERMIT], [rtp.extra[tpc.TREE_NAME]]: rtp.extra[tpc.NUMBER_OF_TREES] };
		}
		else { // a new one
			treePermits[key] = new TreePermit({ ...rtp.core, [tpc.TOTAL_TREES]: Number(rtp.extra[tpc.NUMBER_OF_TREES]) });
			treePermits[key].attributes[tpc.TREES_PER_PERMIT] = { [rtp.extra[tpc.TREE_NAME]]: rtp.extra[tpc.NUMBER_OF_TREES] };
		}
	});
	return Object.values(treePermits);
}

function formatDate(strDate, hour) {
	const isoDate = new Date(strDate).toISOString().split('T')[0]; //Date
	return `${isoDate}T${hour}`;
}

function generateFilenameByTime(url) {
	const parsedFile = path.parse(url);
	const filenameNoDate = parsedFile.base;
	const filenameWithDate = parsedFile.name.toLowerCase() + '-' + moment().format('YYYY-MM-DD-hh-mm-ss') + parsedFile.ext.toLowerCase();
	const localFilename = path.resolve(treesRawDataDir, filenameNoDate);
	return { s3filename: filenameWithDate, localFilename: localFilename };
}

async function crawlRegionalTreePermit(url) {
	try {
		const { s3filename, localFilename } = generateFilenameByTime(url);
		const treePermits = await getRegionalTreePermitsFromFile(url, localFilename);
		const newTreePermits = await saveNewTreePermits(treePermits);
		Log.info('Extracted ' + newTreePermits.length + ' new permits from: ' + s3filename);
		if (useS3) {
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
	Log.info(`Successfully Uploaded to ${bucketName}/${keyName}. Status code: ${res.$response.httpResponse.statusCode}`);
}

module.exports = {
	regionalTreePermit,
	generateGeomFromAddress
};

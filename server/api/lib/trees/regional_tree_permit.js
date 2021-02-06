const Log = require('../log');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const https = require('https');
const fetch = require('node-fetch');
const moment = require('moment');
const AbortController = require('abort-controller');
const aws = require('aws-sdk');

const TreePermit = require('../../model/tree_permit');
const tpc = require('../../model/tree_permit_constants');
const database = require('../../service/database');
const Config = require('../../lib/config');
const Geocoder = require('../../service/osm_geocoder');

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
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/after_darom.XLS',
	//KKL - Keren Kayemet LeIsrael
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/trees_befor.xlsx',
	'https://www.moag.gov.il/yhidotmisrad/forest_commissioner/rishyonot_krita/Documents/trees_after.xlsx'
];

const SHEET_BEFORE = 'Data2ToExcel_BeforDate';
const SHEET_AFTER = 'Data2ToExcel_ToDate';
const KKL = 'Rep03-License-List-To-Excel-Las';

const TIMEOUT_MS = 15000;
const MORNING = '08:00';
const EVENING = '20:00';

const { treeBucketName: bucketName, useS3ForTreeFiles: useS3 } = Config.get('aws');
const treesRawDataDir = path.resolve(Config.get('trees.rawDataDir'));
const GEO_CODING_INTERVAL = Config.get('trees.geoCodingInterval');
const MAX_PERMITS = Config.get('trees.maxPermits');

async function getRegionalTreePermitsFromFile(url, pathname) {
	try {
		const controller = new AbortController();
		const controllerTimeout = setTimeout(
			() => { controller.abort(); },
			TIMEOUT_MS,
		);
		Log.info('Fetching trees file... ' + `${url}`);
		return new Promise(async (resolve, reject) => {
			try {
				// use new agent for request to avoid consecutive-request-hanging bug
				// NOTE: we use https.Agent since all urls are currently https. if a http
				// url is added there needs to be a condition here to use the correct agent
				const res = await fetch(url, { signal: controller.signal, agent: new https.Agent() });
				const stream = fs.createWriteStream(pathname);
				stream.on('open', () => {
					res.body.pipe(stream);
				});
				stream.on('close', async function () {
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
				clearTimeout(controllerTimeout);
			}
		});
	}
	catch (err) {
		Log.error(err);
		return Promise.reject();
	}
}

async function saveNewTreePermits(treePermits, maxPermits) {
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

	const newTreePermits = treePermits.map(tp => {
		//if tp is not in the hash map of the existing one - add to the new ones
		const compact_tp = `${tp.attributes[tpc.REGIONAL_OFFICE]}_${tp.attributes[tpc.PERMIT_NUMBER]}_${formatDate(tp.attributes[tpc.START_DATE], MORNING, 'YYYY-MM-DD')}`;
		if (tp.attributes[tpc.REGIONAL_OFFICE] == regionalOffice && !existingPermitsCompact.has(compact_tp)) {
			Log.debug(`A new tree liecence! queued for saving ${compact_tp}`);
			return tp; //original one, not compact
		}
	}).filter(Boolean); // remove undefined values
	//save only the new ones
	try {
		const numPermits = (newTreePermits.length > maxPermits)? maxPermits : newTreePermits.length;
		const savedTreePermits = [];
		// Not using map / async on purpose, so node won't run this code snippet in parallel
		for (const tp of newTreePermits.slice(0,numPermits)){
			await new Promise(r => setTimeout(r, GEO_CODING_INTERVAL)); // max rate to query nominatim is 1 request per second
			const polygonFromPoint = await generateGeomFromAddress(tp.attributes[tpc.PLACE], tp.attributes[tpc.STREET]);
			tp.attributes[tpc.GEOM] = polygonFromPoint;
			Log.info(`Saving new tree permit: ${tp.attributes[tpc.REGIONAL_OFFICE]} ${tp.attributes[tpc.PERMIT_NUMBER]} with ${tp.attributes[tpc.TOTAL_TREES]} trees.`);
			await tp.save();
			savedTreePermits.push(tp);
		}	
		return savedTreePermits;
	}
	catch (err) {
		Log.error(err.message || err);
		return [];
	}
}

const getValueBySheetName = (row, tree_permit_field, sheetName) => {

	if (sheetName === SHEET_AFTER || sheetName === SHEET_BEFORE ){
		if (tree_permit_field === tpc.REGIONAL_OFFICE) return row['אזור'];
		if (tree_permit_field === tpc.PERSON_REQUEST_NAME) return row['מבקש'];
		if (tree_permit_field === tpc.REASON_DETAILED) return row['פרטי הסיבה'];
		if (tree_permit_field === tpc.PLACE) return row['מקום הפעולה'];
		if (tree_permit_field === tpc.STREET_NUMBER) return row['מספר'];
		if (tree_permit_field === tpc.START_DATE) return formatDate(row['מתאריך'], MORNING, 'MM/DD/YYYY');
		if (tree_permit_field === tpc.END_DATE) return formatDate(row['עד תאריך'], MORNING, 'MM/DD/YYYY');
		if (tree_permit_field === tpc.LAST_DATE_TO_OBJECTION) return row['תאריך אחרון להגשת ערער'] ? formatDate(row['תאריך אחרון להגשת ערער'], EVENING, 'MM/DD/YYYY') : undefined;
		if (tree_permit_field === tpc.APPROVER_NAME) return row['שם מאשר'];
		if (tree_permit_field === tpc.APPROVER_TITLE) return row['תפיד מאשר'];
		if (tree_permit_field === tpc.TREE_NAME) return row['שם העץ'];
		if (tree_permit_field === tpc.COMMENTS_IN_DOC) return row['הערות לעצים'];
		if (tree_permit_field === tpc.PERMIT_NUMBER) return row['מספר רשיון'];
		if (tree_permit_field === tpc.PERMIT_ISSUE_DATE) return formatDate(row['תאריך הרשיון'], MORNING, 'MM/DD/YYYY') ;
	}
	if (sheetName === KKL) {
		// Each regional office has its own numbering for permits.
		// KKL shares numbering across all its regions, as well as they publish in the same file.
		// Therefore, their regional office unit is one (קקל) and the sub division for regions manifest in 
		// the field 'approver_title'.
		if (tree_permit_field === tpc.REGIONAL_OFFICE) return 'קקל'; 
		if (tree_permit_field === tpc. PERSON_REQUEST_NAME) return row['  שם   בעל הרישיון'];
		if (tree_permit_field === tpc.REASON_DETAILED) return row['סיבה  מילולית'];
		if (tree_permit_field === tpc.PLACE) return row['יישוב'];
		if (tree_permit_field === tpc.STREET_NUMBER) return row['\'מס'];
		if (tree_permit_field === tpc.START_DATE) return formatDate(row['מ-תאריך'], MORNING);
		if (tree_permit_field === tpc.END_DATE) return formatDate(row['עד-תאריך'], MORNING);
		if (tree_permit_field === tpc.LAST_DATE_TO_OBJECTION) return row['תאריך אחרון להגשת ערר'] ? formatDate(row['תאריך אחרון להגשת ערר'], EVENING) : undefined;
		if (tree_permit_field === tpc.APPROVER_NAME) return row['שם   מאשר הרישיון'];
		if (tree_permit_field === tpc.APPROVER_TITLE) return row['אזור'];
		if (tree_permit_field === tpc.TREE_NAME) return row['שם   מין עץ']; 
		if (tree_permit_field === tpc.COMMENTS_IN_DOC) return row['הערות'];
		if (tree_permit_field === tpc.PERMIT_NUMBER) return row['מספר רישיון'];
		if (tree_permit_field === tpc.PERMIT_ISSUE_DATE) return undefined;
	}

	Log.error(`Bad conversion: no such ${tree_permit_field} in sheet: ${sheetName} in row: ${row}`);
	return '';
};

const figureSheetName = (filename) => {
	const fname = path.parse(filename).name.toLowerCase();
	if (fname === 'trees_befor' || fname === 'trees_after') return KKL;
	if (fname.includes('after')) return SHEET_AFTER;
	else return SHEET_BEFORE;
};

const isEmptyRow = (row) => {
	return (Object.values(row).filter(Boolean).length === 0);
};

const parseTreesXLS = async (filename) => {
	// hack
	const sheetname = figureSheetName(filename);
	const workbook = xlsx.readFile(filename);
	const sheet = workbook.Sheets[sheetname];
	const sheet_json = (sheetname === KKL)? xlsx.utils.sheet_to_json(sheet, { raw: false, range: 1  , blankrows: false } ) : xlsx.utils.sheet_to_json(sheet, { raw: false });
	const rawTreePermits = sheet_json.map(row => {

		try {
			if (!isEmptyRow(row)) return {
				'core': {
					[tpc.REGIONAL_OFFICE]: getValueBySheetName(row, tpc.REGIONAL_OFFICE, sheetname),
					[tpc.PERMIT_NUMBER]: getValueBySheetName(row, tpc.PERMIT_NUMBER, sheetname),
					[tpc.ACTION]: row['פעולה'], // cutting , copying
					[tpc.PERMIT_ISSUE_DATE]: getValueBySheetName(row, tpc.PERMIT_ISSUE_DATE, sheetname),
					[tpc.PERSON_REQUEST_NAME]: getValueBySheetName(row, tpc.PERSON_REQUEST_NAME, sheetname),
					[tpc.START_DATE]: getValueBySheetName(row, tpc.START_DATE, sheetname),
					[tpc.END_DATE]: getValueBySheetName(row, tpc.END_DATE, sheetname),
					[tpc.LAST_DATE_TO_OBJECTION]: getValueBySheetName(row, tpc.LAST_DATE_TO_OBJECTION, sheetname),
					[tpc.APPROVER_NAME]: getValueBySheetName(row, tpc.APPROVER_NAME, sheetname),
					[tpc.APPROVER_TITLE]: getValueBySheetName(row, tpc.APPROVER_TITLE, sheetname),
					// Location
					[tpc.PLACE]: getValueBySheetName(row, tpc.PLACE, sheetname),
					[tpc.STREET]: row['רחוב'],
					[tpc.STREET_NUMBER]: getValueBySheetName(row, tpc.STREET_NUMBER, sheetname),
					[tpc.GUSH]: row['גוש'],
					[tpc.HELKA]: row['חלקה'],

					[tpc.REASON_SHORT]: row['סיבה'],
					[tpc.REASON_DETAILED]: getValueBySheetName(row, tpc.REASON_DETAILED, sheetname),
					[tpc.COMMENTS_IN_DOC]: getValueBySheetName(row, tpc.COMMENTS_IN_DOC, sheetname),	
				},
				'extra': {
					[tpc.TREE_NAME]: getValueBySheetName(row, tpc.TREE_NAME, sheetname),
					[tpc.NUMBER_OF_TREES]: row['מספר עצים'],
				}
			};
		}
		catch (err) {
			Log.error(`Error reading line ${getValueBySheetName(row, tpc.PERMIT_NUMBER, sheetname)}-${getValueBySheetName(row, tpc.TREE_NAME, sheetname)} from file ${filename}`);
			Log.error(err);
		}
	});
	return processPermits(rawTreePermits.filter(Boolean));
};

async function generateGeomFromAddress(place, street) {
	
	let res = '';
	const address = `${place} ${street || ''}`;
	Log.debug(`address: ${address} `);

	if (!place) return;
	if (place && street) {
		res = await Geocoder.getGeocode(place, street);
		if (!res) { // try geocode place only
			Log.debug(`Couldn't geocode address: ${address}. try to fetch place from db.`);
			res = await Geocoder.fetchOrGeocodePlace({ 'db':database.Knex, 'table':tpc.TREE_PERMIT_TABLE, 'place': place });
			if (!res ) {
				Log.debug(`Failed to geocode address: ${place}`);
				return;
			}
		}
		Log.debug(`Managed to geocode address ${address} : ${res.longitude},${res.latitude} `);

	}
	else { // only place, no street
		res = await Geocoder.fetchOrGeocodePlace({ 'db':database.Knex, 'table':tpc.TREE_PERMIT_TABLE, 'place': place });
		if (!res ) {
			Log.debug(`Failed to geocode address: ${place}`);
			return;
		}
	} 
	const polygonFromPoint = JSON.parse(`{ "type": "Polygon", "coordinates": [[ [ ${res.longitude}, ${res.latitude}],[ ${res.longitude}, ${res.latitude}],[ ${res.longitude}, ${res.latitude}],[ ${res.longitude}, ${res.latitude}]  ]] }`);
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

			if ( Object.keys(treePermits[key].attributes[tpc.TREES_PER_PERMIT]).includes(rtp.extra[tpc.TREE_NAME])){
				treePermits[key].attributes[tpc.TREES_PER_PERMIT][rtp.extra[tpc.TREE_NAME]] = treePermits[key].attributes[tpc.TREES_PER_PERMIT][rtp.extra[tpc.TREE_NAME]] + Number(rtp.extra[tpc.NUMBER_OF_TREES]);
			}
			else{
				treePermits[key].attributes[tpc.TREES_PER_PERMIT] = { ...treePermits[key].attributes[tpc.TREES_PER_PERMIT], [rtp.extra[tpc.TREE_NAME]]: Number(rtp.extra[tpc.NUMBER_OF_TREES]) };
			}
		}
		else { // a new one
			treePermits[key] = new TreePermit({ ...rtp.core, [tpc.TOTAL_TREES]: Number(rtp.extra[tpc.NUMBER_OF_TREES]) || 0 });
			treePermits[key].attributes[tpc.TREES_PER_PERMIT] = { [rtp.extra[tpc.TREE_NAME] || 'לא צוין סוג העץ']: Number(rtp.extra[tpc.NUMBER_OF_TREES]) };
		}
	});
	return Object.values(treePermits);
}

function formatDate(strDate, hour, inputFormat) {
	if (strDate == '' || strDate == undefined) return undefined;
	const format = inputFormat || 'DD/MM/YYYY';
	const isoDate = moment(strDate, format).toISOString().split('T')[0]; //Date
	return `${isoDate}T${hour}`;
}

function generateFilenameByTime(url) {
	const parsedFile = path.parse(url);
	const filenameNoDate = parsedFile.base;
	const filenameWithDate = parsedFile.name.toLowerCase() + '-' + moment().format('YYYY-MM-DD-hh-mm-ss') + parsedFile.ext.toLowerCase();
	const localFilename = path.resolve(treesRawDataDir, filenameNoDate);
	return { s3filename: filenameWithDate, localFilename: localFilename };
}

async function crawlRegionalTreePermit(url, maxPermits) {
	try {
		const { s3filename, localFilename } = generateFilenameByTime(url);
		const treePermits = await getRegionalTreePermitsFromFile(url, localFilename);
		const newTreePermits = await saveNewTreePermits(treePermits, maxPermits);
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
const regionalTreePermit = async() => {
	let sumPermits = 0;
	let maxPermits = MAX_PERMITS;
	try {
		for (let i = 0; i < regionalTreePermitUrls.length && maxPermits > 0; i++) {
			const numSavedPermits = await crawlRegionalTreePermit(regionalTreePermitUrls[i], maxPermits);
			maxPermits = maxPermits - numSavedPermits;
			sumPermits = sumPermits + numSavedPermits;
		}
	}
	catch (err) {
		Log.error(err.message || err);
	}
	Log.info(`Done! Total ${sumPermits} new permits`);
	return sumPermits;
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

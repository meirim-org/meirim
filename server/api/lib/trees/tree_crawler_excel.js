const Log = require('../log');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const https = require('https');
const fetch = require('node-fetch');
const moment = require('moment');
const AbortController = require('abort-controller');
const TreePermit = require('../../model/tree_permit');
const database = require('../../service/database');
const Config = require('../../lib/config');

const TIMEOUT_MS = 15000;
const MORNING = '08:00';
const EVENING = '20:00';

const { treeBucketName: bucketName, useS3ForTreeFiles: useS3 } = Config.get('aws');
const localTrees = path.resolve(Config.get('trees.rawDataDir'));
const GEO_CODING_INTERVAL = Config.get('trees.geoCodingInterval');
const MAX_PERMITS = Config.get('trees.maxPermits');

const {
	REGIONAL_OFFICE, START_DATE, PERMIT_NUMBER, APPROVER_TITLE, ACTION, APPROVER_NAME,
	END_DATE, LAST_DATE_TO_OBJECTION, TREE_NAME, TOTAL_TREES, REASON_DETAILED,
	REASON_SHORT, GUSH, HELKA, GEOM, PLACE, STREET, STREET_NUMBER, COMMENTS_IN_DOC,
	TREES_PER_PERMIT, PERSON_REQUEST_NAME, PERMIT_ISSUE_DATE, TREE_PERMIT_TABLE, NUMBER_OF_TREES
} = require('../../model/tree_permit_constants');

const {
	generateFilenameByTime,
	formatDate,
	figureStartDate,
	unifyPlaceFormat,
	isEmptyRow, 
	generateGeomFromAddress, 
	uploadToS3
} = require('./utils');
const { RegionalTreePermit } = require( './regional_tree_permit');
const { KKLTreePermit } = require ('./kkl_tree_permit');

async function getTreePermitsFromFile(url, pathname, permitType) {
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

					const treePermits = await parseTreesXLS(pathname, permitType);
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
	const regionalOffice = treePermits[0].attributes[REGIONAL_OFFICE];
	// this is the only timestamp format knex correcrtly work with 
	const time_ago = moment().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ssZ');
	const existingPermitsCompact = new Set();
	await database.Knex(TREE_PERMIT_TABLE).where('updated_at', '>', time_ago.toString())
		.andWhere(REGIONAL_OFFICE, regionalOffice)
		.then(rows => {
			rows.map(row => {
				const key_as_string = `${row[REGIONAL_OFFICE]}_${row[PERMIT_NUMBER]}_${formatDate(row[START_DATE], MORNING, 'YYYY-MM-DD')}`;
				existingPermitsCompact.add(key_as_string);
			});
		})
		.catch(function (error) { Log.error(error); });

	const newTreePermits = treePermits.map(tp => {
		//if tp is not in the hash map of the existing one - add to the new ones
		const compact_tp = `${tp.attributes[REGIONAL_OFFICE]}_${tp.attributes[PERMIT_NUMBER]}_${formatDate(tp.attributes[START_DATE], MORNING, 'YYYY-MM-DD')}`;
		if (tp.attributes[REGIONAL_OFFICE] == regionalOffice && !existingPermitsCompact.has(compact_tp)) {
			Log.debug(`A new tree liecence! queued for saving ${compact_tp}`);
			return tp; //original one, not compact
		}
	}).filter(Boolean); // remove undefined values
	//save only the new ones
	try {
		const numPermits = (newTreePermits.length > maxPermits) ? maxPermits : newTreePermits.length;
		const savedTreePermits = [];
		// Not using map / async on purpose, so node won't run this code snippet in parallel
		for (const tp of newTreePermits.slice(0, numPermits)) {
			await new Promise(r => setTimeout(r, GEO_CODING_INTERVAL)); // max rate to query nominatim is 1 request per second
			const polygonFromPoint = await generateGeomFromAddress(database.Knex, tp.attributes[PLACE], tp.attributes[STREET]);
			tp.attributes[GEOM] = polygonFromPoint;
			Log.info(`Saving new tree permit: ${tp.attributes[REGIONAL_OFFICE]} ${tp.attributes[PERMIT_NUMBER]} with ${tp.attributes[TOTAL_TREES]} trees.`);
			tp.attributes[PLACE] = unifyPlaceFormat(tp.attributes[PLACE]);
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
const parseTreesXLS = async (filename, permit) => {
	const workbook = xlsx.readFile(filename);
	const sheet = workbook.Sheets[workbook.SheetNames[0]];
	const sheet_json =permit.convertSheetToRows(sheet);
	const rawTreePermits = sheet_json.map(row => {
		try {
			if (!isEmptyRow(row)) return {
				'core': {
					// Beurocracy
					[REGIONAL_OFFICE]: permit.getRegionalOffice(row),
					[PERMIT_NUMBER]: row[permit[PERMIT_NUMBER]],
					[PERSON_REQUEST_NAME]: row[permit[PERSON_REQUEST_NAME]],
					[APPROVER_NAME]: row[permit[APPROVER_NAME]],
					[APPROVER_TITLE]: row[permit[APPROVER_TITLE]],
					// Dates
					[PERMIT_ISSUE_DATE]: formatDate(row[permit[PERMIT_ISSUE_DATE]], MORNING, permit.dateFormat),			
					[START_DATE]: formatDate(row[permit[START_DATE]], MORNING, permit.dateFormat) || figureStartDate(row[permit[PERMIT_ISSUE_DATE]],MORNING, permit.dateFormat),
					[END_DATE]: formatDate(row[permit[END_DATE]], EVENING, permit.dateFormat),
					[LAST_DATE_TO_OBJECTION]: row[permit[LAST_DATE_TO_OBJECTION]] ? formatDate(row[permit[LAST_DATE_TO_OBJECTION]], EVENING, permit.dateFormat) : undefined,
					// Location
					[PLACE]: row[permit[PLACE]],
					[STREET]: row[permit[STREET]],
					[STREET_NUMBER]: row[permit[STREET_NUMBER]],
					[GUSH]: row[permit[GUSH]],
					[HELKA]: row[permit[HELKA]],
					// Action
					[ACTION]: row[permit[ACTION]], // cutting , copying
					[REASON_SHORT]: row[permit[REASON_SHORT]],
					[REASON_DETAILED]: row[permit[REASON_DETAILED]],
					[COMMENTS_IN_DOC]: row[permit[COMMENTS_IN_DOC]],
				},
				'extra': { // goes into tree_per_permit and total trees
					[TREE_NAME]: row[permit[TREE_NAME]],
					[NUMBER_OF_TREES]: row[permit[NUMBER_OF_TREES]],
				}
			};
		}
		catch (err) {
			Log.error(`Error reading line ${row[permit[PERMIT_NUMBER]]}-${row[permit[TREE_NAME]]} from file ${filename}`);
			Log.error(err);
		}
	});
	return processPermits(rawTreePermits.filter(Boolean));
};

function processPermits(rawTreePermits) {
	// Migrate all rows of each tree permit into one line: address, dates etc.
	// Add sum of all trees in the permit
	// Keep the details per tree kind / number of trees into a tree table
	const treePermits = {};
	rawTreePermits.map(rtp => {
		const key = `${rtp.core[REGIONAL_OFFICE]}_${rtp.core[PERMIT_NUMBER]}_${rtp.core[START_DATE]}}`;
		if (treePermits[key] && treePermits[key].attributes[TOTAL_TREES]) { //exist
			treePermits[key].attributes[TOTAL_TREES] = treePermits[key].attributes[TOTAL_TREES] + Number(rtp.extra[NUMBER_OF_TREES]);

			if (Object.keys(treePermits[key].attributes[TREES_PER_PERMIT]).includes(rtp.extra[TREE_NAME])) {
				treePermits[key].attributes[TREES_PER_PERMIT][rtp.extra[TREE_NAME]] = treePermits[key].attributes[TREES_PER_PERMIT][rtp.extra[TREE_NAME]] + Number(rtp.extra[NUMBER_OF_TREES]);
			}
			else {
				treePermits[key].attributes[TREES_PER_PERMIT] = { ...treePermits[key].attributes[TREES_PER_PERMIT], [rtp.extra[TREE_NAME]]: Number(rtp.extra[NUMBER_OF_TREES]) };
			}
		}
		else { // a new one
			treePermits[key] = new TreePermit({ ...rtp.core, [TOTAL_TREES]: Number(rtp.extra[NUMBER_OF_TREES]) || 0 });
			treePermits[key].attributes[TREES_PER_PERMIT] = { [rtp.extra[TREE_NAME] || 'לא צוין סוג העץ']: Number(rtp.extra[NUMBER_OF_TREES]) };
		}
	});
	return Object.values(treePermits);
}

async function crawTreeExcelByFile(url, maxPermits, permitType) {
	try {
		const { s3filename, localFilename } = generateFilenameByTime(url, localTrees);
		const treePermits = await getTreePermitsFromFile(url, localFilename, permitType);
		const newTreePermits = await saveNewTreePermits(treePermits, maxPermits);
		Log.info('Extracted ' + newTreePermits.length + ' new permits from: ' + s3filename);
		if (useS3) {
			await uploadToS3(s3filename, bucketName, localFilename);
		}
		return newTreePermits.length;
	} catch (err) {
		Log.error(err.message || err);
		return false;
	}
}

const chooseCrawl = (permitType) => {
	if (permitType == ''|| permitType == 'all' || permitType == undefined) {
		return [RegionalTreePermit, KKLTreePermit];
	}
	if (permitType == 'kkl') {
		return [KKLTreePermit];
	}
	if (permitType == 'regional') {
		return [RegionalTreePermit];
	}
	return [];
};

const crawlTreesExcel = async ( crawlMethod ) => {
	let sumPermits = 0;
	let maxPermits = MAX_PERMITS;
	const crawlMethods = chooseCrawl(crawlMethod);
	
	for ( const permitType of crawlMethods) {
		try {
			for (let i = 0; i < permitType.urls.length && maxPermits > 0; i++) {
				const numSavedPermits = await crawTreeExcelByFile(permitType.urls[i], maxPermits, permitType);
				maxPermits = maxPermits - numSavedPermits;
				sumPermits = sumPermits + numSavedPermits;
			}
		}
		catch (err) {
			Log.error(err.message || err);
		}
	}
	Log.info(`Done! Total ${sumPermits} new permits`);
	return sumPermits;
};

module.exports = {
	crawlTreesExcel: crawlTreesExcel,
};

const Log = require('../log');
const fs = require('fs');
const os = require('os');
const path = require('path');
const xlsx = require('xlsx');
const https = require('follow-redirects').https;
const AbortController = require('abort-controller');
const TreePermit = require('../../model/tree_permit');
const Config = require('../../lib/config');
const { downloadChallengedFile } = require('../challanged-file');

const TIMEOUT_MS = 15000;
const MORNING = '08:00';
const EVENING = '20:00';

const { treeBucketName: bucketName, useS3ForTreeFiles: useS3 } = Config.get('aws');
const localTrees = os.tmpdir()  

const {
	REGIONAL_OFFICE, START_DATE, PERMIT_NUMBER, APPROVER_TITLE, ACTION, APPROVER_NAME,
	END_DATE, LAST_DATE_TO_OBJECTION, TREE_NAME, TOTAL_TREES, REASON_DETAILED,
	REASON_SHORT, GUSH, HELKA, PLACE, STREET, STREET_NUMBER, COMMENTS_IN_DOC,
	TREES_PER_PERMIT, PERSON_REQUEST_NAME, PERMIT_ISSUE_DATE, NUMBER_OF_TREES
} = require('../../model/tree_permit_constants');

const { HaifaTreePermit } = require('./haifa_tree_permit');

const {
	generateFilenameByTime,
	formatDate,
	figureStartDate,
	calculateLastDateToObject,
	isEmptyRow,
	uploadToS3
} = require('./utils');


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
				const stream = fs.createWriteStream(pathname);
				let res = await downloadChallengedFile(url, stream, { signal: controller.signal, agent: new https.Agent() });

				if (! res) {
					// Failed to download - try again. gov.il servers have the tendancy to fail the first time
					Log.info('Failed to reach gov.il on the first time. try again...')
					res = await downloadChallengedFile(url, stream, { signal: controller.signal, agent: new https.Agent() },);
				}

				if ( ! res) {
					Log.error('Couldnt read tree files. exit :(');
					resolve(null);
				}
				const treePermits = await parseTreesXLS(pathname, permitType);
				resolve(treePermits);
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

const parseTreesXLS = async (filename, permit) => {
	const workbook = xlsx.readFile(filename);
	const sheet = workbook.Sheets[workbook.SheetNames[0]];
	const sheet_json =permit.convertSheetToRows(sheet);
	const rawTreePermits = sheet_json.map(row => {
		try {
			if (!isEmptyRow(row)) {

				const start_date = row[permit[START_DATE]];
				return {
					'core': {
						// Beurocracy
						[REGIONAL_OFFICE]: permit.getRegionalOffice(row),
						[PERMIT_NUMBER]: row[permit[PERMIT_NUMBER]],
						[PERSON_REQUEST_NAME]: row[permit[PERSON_REQUEST_NAME]],
						[APPROVER_NAME]: row[permit[APPROVER_NAME]],
						[APPROVER_TITLE]: row[permit[APPROVER_TITLE]],
						// Dates
						[PERMIT_ISSUE_DATE]: formatDate(row[permit[PERMIT_ISSUE_DATE]], MORNING, permit.dateFormat),
						[START_DATE]: formatDate(start_date, MORNING, permit.dateFormat) || 
							figureStartDate(row[permit[PERMIT_ISSUE_DATE]], row[permit[LAST_DATE_TO_OBJECTION]], MORNING, permit.dateFormat, 
								permit[REGIONAL_OFFICE] == HaifaTreePermit[REGIONAL_OFFICE]),
						[END_DATE]: formatDate(row[permit[END_DATE]], EVENING, permit.dateFormat),
						[LAST_DATE_TO_OBJECTION]: row[permit[LAST_DATE_TO_OBJECTION]] ?
							formatDate(row[permit[LAST_DATE_TO_OBJECTION]], EVENING, permit.dateFormat) :
							calculateLastDateToObject(start_date, EVENING, permit.dateFormat),
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
		}
		catch (err) {
			Log.error(`Error reading line ${row[permit[PERMIT_NUMBER]]}-${row[permit[TREE_NAME]]} from file ${filename}`);
			Log.error(err.message);
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

async function crawlTreeExcelByFile(url, permitType) {
	try {
		const { s3filename, localFilename } = generateFilenameByTime(url, localTrees);
		const treePermits = await getTreePermitsFromFile(url, localFilename, permitType);
		if (useS3) {
			await uploadToS3(s3filename, bucketName, localFilename);
		}
		return treePermits;
	} catch (err) {
		Log.error(err.message || err);
		return false;
	}
}

module.exports = {
	crawlTreeExcelByFile
};

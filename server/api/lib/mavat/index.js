// const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const Bluebird = require('bluebird');
const puppeteer = require('puppeteer');
const { map, get, isArray } = require('lodash');
const HtmlTableToJson = require('html-table-to-json');
const https = require('follow-redirects').https;
const Log = require('../../lib/log');
const path = require('path');
const fs = require('fs');
const { getFileUrl, formatFile } = require('./files');
const { clearOldPlanFiles, processPlanInstructionsFile } = require('./planInstructions/');
const { downloadChallengedFile } = require('../challanged-file');
const PlanStatusChange = require('../../model/plan_status_change');
const { formatDate } = require('../date');
const proxy = require('../proxy');

const mavatSearchPage = 'http://mavat.moin.gov.il/MavatPS/Forms/SV3.aspx?tid=3';
const newMavatURL = 'https://mavat.iplan.gov.il/rest/api/SV4/1';

let browser = false;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

const PLAN_DOWNLOAD_PATH = path.join(__dirname, './tmp');

// TODO: remove this function
const init = () =>
	new Promise((resolve, reject) => {
		(async () => {
			try {
				if (!browser) {
					Log.debug('Launching chrome');
					browser = await puppeteer.launch({
						headless: true,
						args: ['--no-sandbox', '--disable-setuid-sandbox']
					});
					Log.debug('Success launching chrome');
				}

				resolve(browser);
			} catch (err) {
				Log.error(err);
				reject(err);
			}
		})();
	});

const downloadPlanPDF = async (entityDocId, entityDocNumber) => {

	const downloadUrl = getFileUrl(entityDocId, entityDocNumber);
	if (!downloadUrl) return false;

	Log.info(`Trying download file for eid=${entityDocId}&enum=${entityDocNumber}`);
	const file = fs.createWriteStream(path.join(__dirname, 'tmp', 'tmpPDF.pdf'));
	const downloadSuccess = await downloadChallengedFile(downloadUrl, file, {}, https);

	if (!downloadSuccess) {
		Log.info(`had a problem downloading file for ${entityDocId}, ${entityDocNumber}`);
	}
	Log.info(`success downloading file for ${entityDocId}, ${entityDocNumber}`);
	return downloadSuccess;
};
const isInstructionsFile = ({ DOC_NAME, FILE_TYPE }) =>  (DOC_NAME.indexOf('הוראות התכנית') !== -1 && FILE_TYPE.indexOf('pdf')!== -1);

const getPlanInstructionsNewMavat = async (planFiles) => {
	const planInstructionsFiles = planFiles.filter(isInstructionsFile);

	if(planInstructionsFiles.length === 0) return undefined;

	const planFileData = planInstructionsFiles[0];

	const hasDownloaded = await downloadPlanPDF(planFileData.ID, planFileData.PLAN_ENTITY_DOC_NUM);
	if (hasDownloaded) {
		try {
			return processPlanInstructionsFile(PLAN_DOWNLOAD_PATH);
		} catch (err) {
			Log.error('Fetch plan instructions error', err);
		}
	}
};
// TODO: remove this function, old mavat
const getPlanInstructions = async (page) => {
	const functionCallText = await page.evaluate(() => {
		const elements = Array.from(document.querySelectorAll('#trCategory3 .clsTableRowNormal td'));
		const innerTexts = elements.map(ele => ele.innerText.trim());
		// elements look like this:
		// [kind, description, thoola, date, file, kind, description, thoola, date, file...]
		// (flattened table)
		for (let i = 0; i < innerTexts.length; i += 5) {
			if ((innerTexts[i] === 'הוראות התכנית' && innerTexts[i + 1] === 'הוראות התכנית') || // before approval
                (innerTexts[i] === 'מסמכים חתומים' && innerTexts[i + 1] === 'תדפיס הוראות התכנית - חתום לאישור')) { // after approval
				return elements[i + 4].querySelector('img').getAttribute('onclick');
			}
		}
		// note: this is run in the headless browser context. `Log` is not available for use
		console.log('couldn\'t find the plan details PDF link on this web page');
		return undefined;
	});

	const hasDownloaded = await downloadPlanPDF(functionCallText);
	if (hasDownloaded) {
		try {
			return processPlanInstructionsFile(PLAN_DOWNLOAD_PATH);
		} catch (err) {
			Log.error('Fetch plan instructions error', err);
		}
	}
};

const getPlanFilesNewMavat = (data) => {
	const files = map(data.rsPlanDocsAdd, (file)=> {
		return {
			kind: file.FILE_TYPE,
			name: file.DOC_NAME,
			description: file.RUB_DESC,
			date: file.EDITING_DATE,
			id: file.ID,
			fileIcon: file.FILE_DATA.ficon,
			num: file.PLAN_ENTITY_DOC_NUM
		};
	});

	// cleaning and formatting the files
	return files.map(formatFile);
};

const fetch = (planUrl, fetchPlanInstruction = true) =>
	new Promise((resolve, reject) => {
		(async () => {
			const page = await browser.newPage();

			try {
				Log.debug('Loading plan page', planUrl);
				await clearOldPlanFiles(PLAN_DOWNLOAD_PATH);

				try {
					await page.goto(planUrl);
					await page.waitForSelector('#divMain');
				} catch (e) {
					page.close();
					Log.error(e);
					reject(e);
				}

				const bodyHTML = await page.evaluate(
					() => document.body.innerHTML
				);
				
				const pageInstructions =  fetchPlanInstruction &&  await getPlanInstructions(page);
				const planFiles = await getPlanFilesNewMavat(page);

				page.close();

				const dom = cheerio.load(bodyHTML, {
					decodeEntities: false
				});
				if (!dom) {
					reject('cheerio dom is null');
				}

				resolve({ cheerioPage: dom, planFiles, pageInstructions  });
			} catch (err) {
				Log.error('Mavat fetch error', err);

				try {
					const bodyHTML = await page.evaluate(
						() => document.body.innerHTML
					);
					Log.error('Mavat fetch error html', bodyHTML);
				} catch (htmlError) {
					Log.error('Mavat fetch error html error', htmlError);
				}
				page.close();
				reject(err);
			}
		})();
	});

// This function opens a pup browser to perform an API request to MAVAT.
// This is because the API is blocked from outside of Israel. The response is JSON
// and the pup browser waits for the auto HTML rendering of the response
const fetchPlanData = (planUrl) =>
	new Promise((resolve, reject) => {
		(async () => {
			const page = await browser.newPage();
			Log.debug('Loading plan page', planUrl);
			try {
				await page.goto(planUrl);
				await page.waitForSelector('body > pre');
				const jsonContent = await page.evaluate(
					() => document.getElementsByTagName('pre')[0].innerText
				);
				resolve({ data: JSON.parse(jsonContent) });
			} catch (e) {
				Log.error('Mavat fetch error with puppeteer', e.message);
				try {
					const jsonContent = await proxy.get(planUrl);
					resolve({ data: JSON.parse(jsonContent) });
					
				} catch (e) {
					Log.error({ message: 'Mavat fetch error with proxy', error: e });
					reject(e);
				}
			}
		})();
	});


	

const search = planNumber =>
	new Promise((resolve, reject) => {
		(async () => {
			const page = await browser.newPage();
			try {
				Log.debug('Loading search page', planNumber);

				await page.goto(mavatSearchPage);
				await page.waitForSelector(
					'#ctl00_ContentPlaceHolder1_txtNumb'
				);
				Log.debug('loaded');
				await page.type(
					'#ctl00_ContentPlaceHolder1_txtNumb',
					planNumber
				);

				await Promise.all([
					page.click('#ctl00_ContentPlaceHolder1_btnFilter'),
					page.waitForNavigation({ waitUntil: 'networkidle0' })
				]);
				await timeout(10 * 1000);
				Log.debug('Clicked and waiting');
				await page.waitForSelector('#divMain');

				const bodyHTML = await page.evaluate(
					() => document.body.innerHTML
				);

				page.close();
				const dom = cheerio.load(bodyHTML, {
					decodeEntities: false
				});
				if (!dom) {
					reject('cheerio dom is null');
				}
				resolve(dom);
			} catch (err) {
				Log.error('Mavat fetch error', err);

				try {
					const bodyHTML = await page.evaluate(
						() => document.body.innerHTML
					);
					Log.error('Mavat fetch error html', bodyHTML);
				} catch (htmlError) {
					Log.error('Mavat fetch error html error', htmlError);
				}
				page.close();
				reject(err);
			}
		})();
	});

const getDirectUrl = planId =>
	`${newMavatURL}/${planId}/310`;
	
// TODO: remove this function, old mavat
const getAreaChanges = cheerioPage => {
	const html = cheerioPage('#tblQuantities tbody').html();

	// a library update led to this conversion using the first row as field names
	// instead of using the field ids as their names, so create a fake first row
	// to be used as headers. in the future we probably should stop using this
	// library in favour of a bit of custom cheerio value extraction code
	const jsonTables = new HtmlTableToJson(
		`<table>
			<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr>
			${html}
		</table>`
	);
	return JSON.stringify(jsonTables.results);
};

const getAreaChangesNewMavat = (quantities = []) => {
	if (!quantities) return '';
	const areaChanges = quantities.map((quantity) => ({
		1: `${quantity.ID}`,
		2: `${quantity.QUANTITY_CODE}`,
		3: quantity.QUANTITY_DESC,
		4: quantity.UNIT_DESC,
		5: quantity.AUTHORISED_QUANTITY,
		6: quantity.AUTHORISED_QUANTITY_ADD || '',
		7: quantity.IMPLEMENTATION,
		8: quantity.DETAILED_PLAN || '',
		9: quantity.REMARK
	}));
	return JSON.stringify([areaChanges]);
};

// TODO: remove this function, old mavat
const getPlanStatusList = cheerioPage => {
	const html = cheerioPage('#tblInternet tbody').html();

	// a library update led to this conversion using the first row as field names
	// instead of using the field ids as their names, so create a fake first row
	// to be used as headers. in the future we probably should stop using this
	// library in favour of a bit of custom cheerio value extraction code
	const jsonTables = new HtmlTableToJson(
		`<table>
			<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr>
			${html}
		</table>`
	);
	return jsonTables.results;
};

const getPlanStatusListNewMavat = statusList => {
	return map(statusList, (statusDetails => ({
		status: statusDetails.LIS_DESC,
		date: formatDate(statusDetails.EIS_DATE),
		status_description: statusDetails.DETAILS
	})));
};


const getPlanStatus = (plan) => {
	const planId = plan.id;
	return new Promise((resolve, reject) => {
		getByPlan(plan, false)
			.then(mavatData => {
				if(!mavatData || !isArray(mavatData?.planStatusList)) {
					return resolve([]);
				}

				const planStatusList = mavatData.planStatusList.map(status => {
					Log.debug(`${`title: ${status.title}: date: ${status.date}`} `);
					return new PlanStatusChange({
						plan_id: planId,
						...status
					});
				});
				resolve(planStatusList);
			}).catch((e)=> {
				Log.error({
					message: "failed to get plan status",
					error: e,
				})
				return resolve([]);
			})
	});
};

const getByPlan = async (plan, fetchPlanInstructions = true) => {
	await init();
	const planId = plan.get('MP_ID');
	if (!planId || planId === 'NOT_FOUND') {
		// TODO- maybe? we can populate agam id from a search service
		throw new Error(`No MP_ID exists for plan ${plan.get('PL_NUMBER')}`);
	}
	const url = `${newMavatURL}/?mid=${planId}`;
	// Performing the new MAVAT API call
	return fetchPlanData(url)
		.catch(er=> {
			Log.error('Mavat fetch error', er);
			return null;
		})
	// return planId ? fetch(plan.get('plan_url'), fetchPlanInstructions ) : search(plan.get('PL_NUMBER'));
		.then(async (response) => {
			if (!response) return null;
			const { data } = response;
			let pageInstructions;
			const planFiles = getPlanFilesNewMavat(data);

			Log.debug(
				'Retrieving',
				plan.get('PL_NUMBER'),
				planFiles.length
			);

			Log.debug(
				'Fetched mavat plan data', {
					PL_NUMBER: plan.get('PL_NUMBER'),
					MP_ID: plan.get('MP_ID')
				}
			);
			return Bluebird.props({
				plan_url: getDirectUrl(planId),
				goals: get(data, 'planDetails.GOALS'),
				mainPlanDetails: get(data, 'planDetails.INSTRACTIONS'),
				areaChanges: getAreaChangesNewMavat(get(data, 'rsQuantities'),),
				jurisdiction: get(data, 'planDetails.AUTH'),
				files: planFiles,
				planStatusList: getPlanStatusListNewMavat(get(data, 'rsInternet', [])),
				planExplanation: pageInstructions ? pageInstructions.planExplanation : undefined,
				chartsOneEight: pageInstructions ? pageInstructions.chartsOneEight : undefined,
				chartFour: pageInstructions ? pageInstructions.chartFour : undefined,
				chartFive: pageInstructions ? pageInstructions.chartFive : undefined,
				chartSix: pageInstructions ? pageInstructions.chartSix : undefined
			});
		}).catch(e => {
			Log.error(`error getByPlan: ${e.message}`, e.stack);
			return Promise.resolve();
		});
};

module.exports = {
	// getByUrl,
	getByPlan,
	init,
	fetch,
	getPlanStatus,

	// exported for tests
	testOnly: {
		downloadChallengedFile
	}
};

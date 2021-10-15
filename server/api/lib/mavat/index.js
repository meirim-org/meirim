// const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const Bluebird = require('bluebird');
const puppeteer = require('puppeteer');
const HtmlTableToJson = require('html-table-to-json');
const Log = require('../../lib/log');
const path = require('path');
const fs = require('fs');
const { getFileUrl, formatFile } = require('./files');
const { clearOldPlanFiles, processPlanInstructionsFile } = require('./planInstructions/');
const { downloadChallengedFile } = require('../challanged-file');

const mavatSearchPage = 'http://mavat.moin.gov.il/MavatPS/Forms/SV3.aspx?tid=3';

let browser = false;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

const PLAN_DOWNLOAD_PATH = path.join(__dirname, './tmp');

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

const downloadPlanPDF = async (functionCallText) => {

	const downloadUrl = getFileUrl(functionCallText);
	if (!downloadUrl) return false;

	const file = fs.createWriteStream(path.join(__dirname, 'tmp', 'tmpPDF.pdf'));
	const downloadSuccess = await downloadChallengedFile(downloadUrl, file);

	if (!downloadSuccess) {
		Log.error(`had a problem downloading file for ${entityDocId}, ${entityDocNumber}`);
	}

	return downloadSuccess;
};

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


const getPlanFiles = async (page) => {
	const files = await page.evaluate(() => {
		const elements = Array.from(document.querySelectorAll('#trCategory3 .clsTableRowNormal td'));
		const innerTexts = elements.map(ele => ele.innerText.trim());

		// elements look like this:
		// [kind, description, thoola, date, file, kind, description, thoola, date, file...]
		// (flattened table)
		let files = [];
		for (let i = 0; i < innerTexts.length; i += 5) {
			const file = {
				kind: innerTexts[i], 
				name: innerTexts[i+1],
				description: innerTexts[i+2],
				date: innerTexts[i+3],
				openDoc: elements[i + 4].querySelector('img').getAttribute('onclick'),
				fileIcon: elements[i + 4].querySelector('img').getAttribute('src')
			};
			files.push(file);
		}

		// console.log(`fetched ${files.length} files`);
		return files;
	});

	// cleaning and formatting the files
	return files.map(formatFile);
};

const fetch = planUrl =>
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

				const pageInstructions = await getPlanInstructions(page);
				const planFiles = await getPlanFiles(page);

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
const getGoalsText = cheerioPage =>
	cheerioPage('#ctl00_ContentPlaceHolder1_tdGOALS').html();

const getMainPlanDetailText = cheerioPage =>
	cheerioPage('#ctl00_ContentPlaceHolder1_tdINSTRACTIONS').html();

const getJurisdictionString = cheerioPage =>
	cheerioPage('#ctl00_ContentPlaceHolder1_AUTH').val();

const getDirectUrl = cheerioPage =>
	cheerioPage('#ctl00_ContentPlaceHolder1_PlanLink').attr('href');

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

// function getShapeFile(cheerioPage) {

//     shapefile.open("example.shp")
//         .then(source => source.read()
//             .then(function log(result) {
//                 if (result.done) return;
//                 console.log(result.value);
//                 return source.read().then(log);
//             }))
//         .catch(error => console.error(error.stack));
// }

// const getByUrl = planUrl =>
//     init()
//         .then(() => fetch(planUrl))
//         .then(cheerioPage => {
//             log.debug("Retrieving", planUrl);

//             return Bluebird.props({
//                 goals: getGoalsText(cheerioPage),
//                 mainPlanDetails: getMainPlanDetailText(cheerioPage),
//                 areaChanges: getAreaChanges(cheerioPage),
//                 jurisdiction: getJurisdictionString(cheerioPage)
//             });
//         });

const getByPlan = plan =>
	init()
		.then(() => {
			return plan.get('plan_url') ? fetch(plan.get('plan_url')) : search(plan.get('PL_NUMBER'));
		})
		.then(dict => {
			const cheerioPage = dict.cheerioPage;
			const pageInstructions = dict.pageInstructions;
			const planFiles = dict.planFiles;

			Log.debug(
				'Retrieving',
				plan.get('PL_NUMBER'),
				getGoalsText(cheerioPage),
				getAreaChanges(cheerioPage),
				planFiles.length
			);

			return Bluebird.props({
				plan_url: getDirectUrl(cheerioPage),
				goals: getGoalsText(cheerioPage),
				mainPlanDetails: getMainPlanDetailText(cheerioPage),
				areaChanges: getAreaChanges(cheerioPage),
				jurisdiction: getJurisdictionString(cheerioPage),
				files: planFiles,
				planExplanation: pageInstructions ? pageInstructions.planExplanation : undefined,
				chartsOneEight: pageInstructions ? pageInstructions.chartsOneEight : undefined,
				chartFour: pageInstructions ? pageInstructions.chartFour : undefined,
				chartFive: pageInstructions ? pageInstructions.chartFive : undefined,
				chartSix: pageInstructions ? pageInstructions.chartSix : undefined
			});
		});

module.exports = {
	// getByUrl,
	getByPlan,
	init,
	fetch,

	// exported for tests
	testOnly: {
		downloadChallengedFile
	}
};

// const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const Bluebird = require('bluebird');
const puppeteer = require('puppeteer');
const HtmlTableToJson = require('html-table-to-json');
const Log = require('../../lib/log');
const path = require('path');
const http = require('follow-redirects').http;
const fs = require('fs');
const { getFileUrl, formatFile } = require('./files');
const { clearOldPlanFiles, processPlanInstructionsFile } = require('./planInstructions/');

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

const downloadChallengedFile = (url, file, options) => {
	return new Promise((resolve) => {
		options = options || {};

		http.get(url, options, (response) => {
			if (response.statusCode !== 200) {
				Log.error(`downloadChallengedFile failed with status ${response.statusCode} for url ${url}`);
				resolve(false);
			} else {
				const contentType = response.headers['content-type'] || '';

				// if content-type is text/html this isn't the file we wish to download but one
				// of the challenge stages
				if (contentType.startsWith('text/html')) {
					// if we didn't get a cookie yet this is the first part of the challenge -
					// the page source contains the javascript code we need to run and challenge
					// paramters for the calculation
					if (!('set-cookie' in response.headers)) {
						// download the entire response so we can solve the challenge
						let responseData = '';
						response.on('data', (chunk) => { responseData += chunk; });
						response.on('end', () => {
							if (responseData.indexOf('ChallengeId=') > -1) {
								// extract challenge params
								const challenge = parseChallenge(responseData);

								// send the request again with the challenge headers
								downloadChallengedFile(url, file, {
									headers: {
										'X-AA-Challenge': challenge.challenge,
										'X-AA-Challenge-ID': challenge.challengeId,
										'X-AA-Challenge-Result': challenge.result
									}
								}).then((res) => resolve(res));
							} else {
								Log.error(`url content type was html, but response contained no challenge: "${responseData.substr(0, 50)}..."`);
								resolve(false);
							}
						});
					} else {
						// if we did get a cookie we completed the challenge successfuly and
						// should use it to download the file
						downloadChallengedFile(url, file, {
							headers: {
								'Cookie': response.headers['set-cookie']
							}
						}).then((res) => resolve(res));
					}
				} else {
					// this is the actual file, so pipe the response into the supplied file
					response.pipe(file);
					file.on('finish', async function () {
						await file.close();
						resolve(true);
					});
				}
			}
		}).on('error', (err) => {
			Log.error(err);
			resolve(false);
		});
	});
};

const parseChallenge = (pageSrc) => {
	// parse a challenge given by mavat's web servers, forcing us to solve a math
	// challenge and send the result as a header to actually get the page.
	// copied from https://github.com/niryariv/opentaba-server/blob/ab15e51bb1ae4733954827d51961bb72796052fd/lib/helpers.py#L109
	const top = pageSrc.split('<script>')[1].split('\n');
	const challenge = top[1].split(';')[0].split('=')[1];
	const challengeId = top[2].split(';')[0].split('=')[1];
	return { challenge, challengeId, result: solveChallenge(challenge) }
}

const solveChallenge = (challenge) => {
	// solve mavat's page challenge.
	// copied from the original challenge since it is javascript code to begin with
	var var_str = '' + challenge;
	var var_arr = var_str.split('');
	var LastDig = var_arr.reverse()[0];
	var minDig = var_arr.sort()[0];
	var subvar1 = (2 * (var_arr[2])) + (var_arr[1] * 1);
	var subvar2 = (2 * var_arr[2]) + var_arr[1];
	var my_pow = Math.pow(((var_arr[0] * 1) + 2), var_arr[1]);
	var x = (challenge * 3 + subvar1) * 1;
	var y = Math.cos(Math.PI * subvar2);
	var answer = x * y;
	answer -= my_pow * 1;
	answer += (minDig * 1) - (LastDig * 1);
	answer = answer + subvar2;
	return answer;
}

const downloadPlanPDF = async (functionCallText) => {

	const downloadUrl = getFileUrl(functionCallText)
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
			// before approval
			if ((innerTexts[i] === 'הוראות התכנית' && innerTexts[i + 1] === 'הוראות התכנית') || // before approval
                (innerTexts[i] === 'מסמכים חתומים' && innerTexts[i + 1] === 'תדפיס הוראות התכנית - חתום לאישור')) { // after approval
				return elements[i + 4].querySelector('img').getAttribute('onclick');
			}
		}
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
			let files = []
			for (let i = 0; i < innerTexts.length; i += 5) {
				const file = {
					kind: innerTexts[i], 
					name: innerTexts[i+1],
					description: innerTexts[i+2],
					date: innerTexts[i+3],
					openDoc: elements[i + 4].querySelector('img').getAttribute('onclick'),
					fileIcon: elements[i + 4].querySelector('img').getAttribute('src')
				}
				files.push(file)
			}

			console.log(`fetched ${files.length} files`);
			return files;
		});

		// cleaning and formatting the files
		return files.map(formatFile)
}

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

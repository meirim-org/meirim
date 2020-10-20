// const requestPromise = require('request-promise');
const cheerio = require("cheerio");
const Bluebird = require("bluebird");
const puppeteer = require("puppeteer");
const HtmlTableToJson = require("html-table-to-json");
const log = require("../../lib/log");
const path = require('path');
const http = require('follow-redirects').http;
const fs = require('fs');

const { clearOldPlanFiles, processPlanInstructionsFile } = require("./planInstructions/");

const mavatSearchPage = 'http://mavat.moin.gov.il/MavatPS/Forms/SV3.aspx?tid=3';

let browser = false;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

const PLAN_DOWNLOAD_PATH = path.join(__dirname, './tmp');


const init = () =>
	new Promise((resolve, reject) => {
		(async () => {
			try {
				if (!browser) {
					log.debug('Launching chrome');
					browser = await puppeteer.launch({
						headless: true,
						args: ['--no-sandbox', '--disable-setuid-sandbox']
					});
					log.debug('Success launching chrome');
				}

				resolve(browser);
			} catch (err) {
				log.error(err);
				reject(err);
			}
		})();
	});


const downloadFile = (url, file, entityDocId, entityDocNumber) => {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            response.pipe(file);
            file.on('finish', async function() {
                await file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            log.error(`had a problem downloading file for ${entityDocId}, ${entityDocNumber}`);
            log.error(err);
            resolve(false);
        });
    });
};


const downloadPlanPDF = async (functionCallText) => {
    if (functionCallText === undefined) {
        return false;
    }

    // functionCallText is in the format `openDoc(X, Y)`
    // where X can be `'6000611696321'` for example
    // and Y can be `'0F249F3C4F7BC0CB0F1AB48D496389B23D5A3144FBBB0E125CC5472DE98A40AE'` for example
    // we wish to find X and Y, so we look for substrings that has numbers and letters between two ' chars.
    const matches = functionCallText.match(/'[\dA-Z]+'/g);
    if (matches === null) {
        return false;
    }

    const entityDocId = matches[0].slice(1, matches[0].length - 1);   // without the beginning and ending quotes
    const entityDocNumber = matches[1].slice(1, matches[1].length - 1);
    const downloadUrl = `http://mavat.moin.gov.il/MavatPS/Forms/Attachment.aspx?edid=${entityDocId}&edn=${entityDocNumber}&opener=AttachmentError.aspx`;
    const file = fs.createWriteStream(path.join(__dirname, 'tmp', 'tmpPDF.pdf'));
    return await downloadFile(downloadUrl, file, entityDocId, entityDocNumber);
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
            if ((innerTexts[i] === 'הוראות התכנית' && innerTexts[i + 1] === 'הוראות התכנית') ||      // before approval
                (innerTexts[i] === 'מסמכים חתומים' && innerTexts[i + 1] === 'תדפיס הוראות התכנית - חתום לאישור')) {   // after approval
                return elements[i + 4].querySelector('img').getAttribute('onclick');
            }
        }
        log.error(`couldn't find the plan details PDF link on this web page`);
        return undefined;
    });

    const hasDownloaded = await downloadPlanPDF(functionCallText);

    if (hasDownloaded) {
        try{
            return processPlanInstructionsFile(PLAN_DOWNLOAD_PATH);
        } catch (err){
            log.error("Fetch plan instructions error", err);
        }
    }
};

const fetch = planUrl =>
    new Promise((resolve, reject) => {
        (async () => {
            const page = await browser.newPage();

            try {
                log.debug("Loading plan page", planUrl);
                await clearOldPlanFiles(PLAN_DOWNLOAD_PATH);

                try {
                    await page.goto(planUrl);
                    await page.waitForSelector("#divMain");
                }
                catch(e) {
                    page.close();
                    log.error(e);
                    reject(e);
                }

                const bodyHTML = await page.evaluate(
                    () => document.body.innerHTML
                );

                const pageInstructions = await getPlanInstructions(page);

                page.close();

                const dom = cheerio.load(bodyHTML, {
                    decodeEntities: false
                });
                if (!dom) {
                    reject("cheerio dom is null");
                }
                resolve({cheerioPage: dom, pageInstructions: pageInstructions});
            } catch (err) {
                log.error("Mavat fetch error", err);

                try {
                    const bodyHTML = await page.evaluate(
                        () => document.body.innerHTML
                    );
                    log.error("Mavat fetch error html", bodyHTML);
                }
                catch (htmlError) {
                    log.error("Mavat fetch error html error", htmlError);
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
                log.debug("Loading search page", planNumber);

                await page.goto(mavatSearchPage);
                await page.waitForSelector(
                    "#ctl00_ContentPlaceHolder1_txtNumb"
                );
                console.log("loaded");
                await page.type(
                    "#ctl00_ContentPlaceHolder1_txtNumb",
                    planNumber
                );

                await Promise.all([
                    page.click("#ctl00_ContentPlaceHolder1_btnFilter"),
                    page.waitForNavigation({ waitUntil: "networkidle0" })
                ]);
                await timeout(10 * 1000);
                console.log("Clicked and waiting");
                await page.waitForSelector("#divMain");

                const bodyHTML = await page.evaluate(
                    () => document.body.innerHTML
                );

                page.close();
                const dom = cheerio.load(bodyHTML, {
                    decodeEntities: false
                });
                if (!dom) {
                    reject("cheerio dom is null");
                }
                resolve(dom);
            } catch (err) {
                log.error("Mavat fetch error", err);

                try {
                    const bodyHTML = await page.evaluate(
                        () => document.body.innerHTML
                    );
                    log.error("Mavat fetch error html", bodyHTML);
                }
                catch(htmlError) {
                    log.error("Mavat fetch error html error", htmlError);
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
	const jsonTables = new HtmlTableToJson(`<table>${html}</table>`);
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
            return plan.get('plan_url') ? fetch(plan.get('plan_url')) : search(plan.get("PL_NUMBER"))
        })
        .then(dict => {
            const cheerioPage = dict.cheerioPage;
            const pageInstructions = dict.pageInstructions;
            log.debug(
                "Retrieving",
                plan.get("PL_NUMBER"),
                getGoalsText(cheerioPage),
                getAreaChanges(cheerioPage)
            );

            return Bluebird.props({
                plan_url: getDirectUrl(cheerioPage),
                goals: getGoalsText(cheerioPage),
                mainPlanDetails: getMainPlanDetailText(cheerioPage),
                areaChanges: getAreaChanges(cheerioPage),
                jurisdiction: getJurisdictionString(cheerioPage),
                planExplanation: pageInstructions ? pageInstructions.planExplanation : undefined,
                chartsOneEight: pageInstructions ? pageInstructions.chartsOneEight : undefined,
                chartFour: pageInstructions ? pageInstructions.chartFour : undefined,
                chartFive: pageInstructions ? pageInstructions.chartFive : undefined,
                chartSix: pageInstructions ? pageInstructions.chartSix : undefined
            });
        });
// const getByPlan = () => Promise.resolve();
module.exports = {
    // getByUrl,
    getByPlan,
    init,
    fetch
};

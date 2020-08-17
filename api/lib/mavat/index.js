// const requestPromise = require('request-promise');
const cheerio = require("cheerio");
const Bluebird = require("bluebird");
const puppeteer = require("puppeteer");
const HtmlTableToJson = require("html-table-to-json");
const log = require("../../lib/log");
const path = require('path');

const { clearOldPlanFiles, processPlanInstructionsFile } = require("./planInstructions/");

const mavatSearchPage = "http://mavat.moin.gov.il/MavatPS/Forms/SV3.aspx?tid=3";

let browser = false;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

const PLAN_DOWNLOAD_PATH = path.join(__dirname, './tmp');


const init = () =>
    new Promise((resolve, reject) => {
        (async () => {
            try {
                if (!browser) {
                    log.debug("Launching chrome");
                    browser = await puppeteer.launch({
                        headless: true,
                        args: ["--no-sandbox", "--disable-setuid-sandbox"]
                    });
                    log.debug("Success launching chrome");
                }

                resolve(browser);
            } catch (err) {
                log.error(err);
                reject(err);
            }
        })();
    });

// download the plan instructions pdf
const getPlanInstructions = async (page) => {
    const shouldDownloadPlanInstructions =  await page.evaluate(() => {
        const matchText = 'הוראות התכנית';
        let firstRowText = document.querySelector('#trCategory3 .clsTableRowNormal').
        querySelector('td').innerText;
        if (firstRowText === matchText) {
            document.querySelector('#trCategory3 .clsTableRowNormal').
            querySelector('img').onclick();
            return true;
        }
        return false;
    });

    if (shouldDownloadPlanInstructions) {
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
                await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: PLAN_DOWNLOAD_PATH});

                await page.goto(planUrl);
                await page.waitForSelector("#divMain");

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
    cheerioPage("#ctl00_ContentPlaceHolder1_tdGOALS").html();

const getMainPlanDetailText = cheerioPage =>
    cheerioPage("#ctl00_ContentPlaceHolder1_tdINSTRACTIONS").html();

const getJurisdictionString = cheerioPage =>
    cheerioPage("#ctl00_ContentPlaceHolder1_AUTH").val();

const getDirectUrl = cheerioPage =>
    cheerioPage("#ctl00_ContentPlaceHolder1_PlanLink").attr("href");

const getAreaChanges = cheerioPage => {
    const html = cheerioPage("#tblQuantities tbody").html();
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
                chartFive: pageInstructions.chartFive,
                planExplanation: pageInstructions.planExplanation
            });
        });
// const getByPlan = () => Promise.resolve();
module.exports = {
    // getByUrl,
    getByPlan
};

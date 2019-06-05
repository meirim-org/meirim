// const requestPromise = require('request-promise');
const cheerio = require("cheerio");
const Bluebird = require("bluebird");
const puppeteer = require("puppeteer");
const HtmlTableToJson = require("html-table-to-json");
const log = require("../../lib/log");

const mavatSearchPage = "http://mavat.moin.gov.il/MavatPS/Forms/SV3.aspx?tid=3";

let browser = false;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

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

// const fetch = planUrl =>
//     new Promise((resolve, reject) => {
//         (async () => {
//             try {
//                 const page = await browser.newPage();
//                 log.debug("Fetching", planUrl);
//                 await page.goto(planUrl);

//                 // await page.screenshot({path: 'screenshot.png'});
//                 await page.waitForSelector("#ctl00_divPageTitle");

//                 // execute standard javascript in the context of the page.
//                 const bodyHTML = await page.evaluate(
//                     () => document.body.innerHTML
//                 );
//                 page.close();
//                 log.debug("Success loading", planUrl);
//                 resolve(
//                     cheerio.load(bodyHTML, {
//                         decodeEntities: false
//                     })
//                 );
//             } catch (err) {
//                 log.error("Mavat fetch error", err);
//                 reject(err);
//             }
//         })();
//     });

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

                // const bodyHTML = await page.evaluate(
                //     selector => document.querySelectorAll(selector),
                //     "#divMain"
                // );
                const bodyHTML = await page.evaluate(
                    () => document.body.innerHTML
                );
                console.log("content loaded");

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
        .then(() => search(plan.get("PL_NUMBER")))
        .then(cheerioPage => {
            log.debug(
                "Retrieving",
                plan.get("PL_NUMBER"),
                getGoalsText(cheerioPage)
            );

            return Bluebird.props({
                plan_url: getDirectUrl(cheerioPage),
                goals: getGoalsText(cheerioPage),
                mainPlanDetails: getMainPlanDetailText(cheerioPage),
                areaChanges: getAreaChanges(cheerioPage),
                jurisdiction: getJurisdictionString(cheerioPage),
                areaChanges: getAreaChanges(cheerioPage)
            });
        });
// const getByPlan = () => Promise.resolve();
module.exports = {
    // getByUrl,
    getByPlan
};

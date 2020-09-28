const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

const { Knex } = require('../api/service/database');
const categorizePlans = require('../data_processing/categorize_plans');

// FIRST AGRUMENT: NAME OF TAG TO MAKE A REPORT ON
// SECOND ARGUMENT: NUMBER OF PLANS TO FETCH FROM THE DB TO MAKE THE REPORT. OPTIONAL!

const tagToExport = process.argv[2];
const numberOfPlans = process.argv.length > 3 ? process.argv[3] : undefined;

// This function is not designed for performance. It should be run only once in a while, it's coded simply but inefficiently.
const getReport = async () => {
    const fileName = `${tagToExport} report.csv`;

    try {
        await unlink(fileName);
        console.log('deleted prev file');
    }
    catch(e) {
        // do nothing, it's fine
    }

    const fileStream = fs.createWriteStream(`${tagToExport} report.csv`, {flags:'a'});
    fileStream.write(`planId,is tagged with ${tagToExport},explanation,planUrl\n`);

    const writeToCsv = async (planId, isTagged, explanation, planUrl) => {
        fileStream.write(`${planId},${isTagged},${explanation ? explanation.replace(/\n/g, ' ').replace(/,/g, '') : explanation},${planUrl}\n`);
    };

    const buildChart = (chartData) => {
        return chartData[0].map(copyAndModifyObj);
    };

    const copyAndModifyObj = (objFromDb) => {
        const newObj = {};
        // deep copy the object, so the next step will not change the knex results
        Object.assign(newObj, objFromDb);
        // remove the unwanted properties
        newObj.plan_id = undefined;
        newObj.id = undefined;
        return newObj;
    };

    const buildChart18 = (charts18KnexRes, chartNumber) => {
        return charts18KnexRes[0].filter(res => res.origin === chartNumber).map(copyAndModifyObj);
    };

    const selectPlansQuery = numberOfPlans !== undefined ? `SELECT id, plan_url, explanation FROM plan LIMIT ${numberOfPlans}` : `SELECT id, plan_url FROM plan`;
    const plansKnexRes = await Knex.raw(selectPlansQuery);

    const idsAndUrls = plansKnexRes[0];
    let howMuchLeft = idsAndUrls.length;
    for (const {id: planId, plan_url: planUrl, explanation} of idsAndUrls) {
        console.log(`${howMuchLeft} plans left`);
        howMuchLeft--;

        // replicate mavatData
        // first, get the data from the db
        const charts18KnexRes = await Knex.raw(`SELECT * FROM tables_18_interests_in_plan WHERE plan_id = ?`, [planId]);
        const chart4KnexRes = await Knex.raw(`SELECT * FROM table_4_area_designation_and_usage WHERE plan_id = ?`, [planId]);
        const chart5KnexRes = await Knex.raw(`SELECT * FROM table_5_building_rights WHERE plan_id = ?`, [planId]);
        const chart6KnexRes = await Knex.raw(`SELECT * FROM table_6_additional_instructions WHERE plan_id = ?`, [planId]);

        // clean the data from the db
        const chart181 = buildChart18(charts18KnexRes, '1.8.1');
        const chart182 = buildChart18(charts18KnexRes, '1.8.2');
        const chart183 = buildChart18(charts18KnexRes, '1.8.3');
        const chart4 = buildChart(chart4KnexRes);
        const chart5 = buildChart(chart5KnexRes);
        const chart6 = buildChart(chart6KnexRes);

        // build the mavatData
        const mavatData = {
            planExplanation: explanation,
            charts18: {
                chart181: chart181,
                chart182: chart182,
                chart183: chart183
            },
            chartFour: chart4,
            chartFive: chart5,
            chartSix: chart6
        };

        const tags = categorizePlans.makeTags(mavatData);

        const isTaggedWithTestTag = tags.some(tagObj => tagObj.tag === tagToExport);
        await writeToCsv(planId, isTaggedWithTestTag, explanation, planUrl);
    }

    fileStream.end();
};


getReport().then(() =>  {
    console.log('report is done!');
    process.exit(0);
});




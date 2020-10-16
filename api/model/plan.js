const Bluebird = require("bluebird");
const Model = require("./base_model");
const Log = require("../lib/log");
const Exception = require("./exception");
const PlanChartFiveRow = require('./plan_chart_five_row');
const PlanChartOneEightRow = require('./plan_chart_one_eight_row');
const PlanChartFourRow = require('./plan_chart_four_row');
const PlanChartSixRow = require('./plan_chart_six_row');

class Plan extends Model {
    get rules() {
        return {
            sent: "integer",
            OBJECTID: ["required", "integer"],
            PLAN_COUNTY_NAME: "string",
            PL_NUMBER: "string",
            PL_NAME: "string",
            // PLAN_CHARACTOR_NAME: 'string',
            data: ["required"],
            geom: ["required", "object"],
            jurisdiction: "string",
            areaChanges: "string",
            rating: ["required", "number"],
            explanation: "string",
        };
    }

    defaults() {
        return {
            sent: 0
        };
    }

    // support json encode for data field
    format(attributes) {
        if (attributes.data) {
            attributes.data = JSON.stringify(attributes.data);
        }
        return super.format(attributes);
    }

    // support json encode for data field
    parse(attributes) {
        try {
            if (attributes.data) {
                attributes.data = JSON.parse(attributes.data);
            }
        } catch (e) {
            Log.error("Json parse error", attributes.data);
        }

        return super.parse(attributes);
    }
    get geometry() {
        return ["geom"];
    }

    get tableName() {
        return "plan";
    }

    initialize() {
        this.on("saving", this._saving, this);
        super.initialize();
    }

    _saving(model, attrs, options) {
        // return new Checkit(model.rules).run(model.attributes);
    }

    canRead(session) {
        return Bluebird.resolve(this);
    }

    static canCreate(session) {
        throw new Exception.NotAllowed("This option is disabled");
    }

    static markPlansAsSent(plan_ids) {
        return new Plan()
            .query(qb => {
                qb.whereIn("id", plan_ids);
            })
            .save(
                {
                    sent: "2"
                },
                {
                    method: "update"
                }
            );
    }

    static fetchByObjectID(objectID) {
        return Plan.forge({
            OBJECTID: objectID
        }).fetch();
    }

    static fetchByPlanID(planID) {
        return Plan.forge({
            [Plan.prototype.idAttribute]: planID
        }).fetch();
    }

    static buildFromIPlan(iPlan, oldPlan = null) {
        const data = {
            OBJECTID: iPlan.properties.OBJECTID,
            PLAN_COUNTY_NAME: iPlan.properties.PLAN_COUNTY_NAME || "",
            PL_NUMBER: iPlan.properties.PL_NUMBER || "",
            PL_NAME: iPlan.properties.PL_NAME || "",
            // 'PLAN_CHARACTOR_NAME': iPlan.properties.PLAN_CHARACTOR_NAME || '',
            data: iPlan.properties,
            geom: iPlan.geometry,
            PLAN_CHARACTOR_NAME: "",
            plan_url: iPlan.properties.PL_URL,
            status: iPlan.properties.STATION_DESC
        };
        if (oldPlan) {
            oldPlan.set(data);
            return oldPlan.save();
        }

        const plan = new Plan(data);
        return plan.save();
    }

    static async setMavatData(plan, mavatData, oldPlan = null) {

        // TODO: UPDATE PLAN INSTEAD OF DON'T DO NOTHING
        if (oldPlan) {
            // exits in db already, don't fetch mavatData
            return;
        }

        const addPlanIdToArray = (chart) => {
            chart.forEach(row => { row.plan_id = plan.id });
        };

        await plan.set({
            goals_from_mavat: mavatData.goals,
            main_details_from_mavat: mavatData.mainPlanDetails,
            jurisdiction: mavatData.jurisdiction,
            areaChanges: mavatData.areaChanges,
            explanation: mavatData.planExplanation
        });
        await plan.save();

        if (mavatData.chartsOneEight !== undefined) {
            const chart181 = mavatData.chartsOneEight.chart181;
            // add plan_id and origin
            chart181.forEach(row => {
                row.plan_id = plan.id;
                row.origin = '1.8.1';
            });

            const chart182 = mavatData.chartsOneEight.chart182;
            chart182.forEach(row => {
                row.plan_id = plan.id;
                row.origin = '1.8.2';
            });

            const chart183 = mavatData.chartsOneEight.chart183;
            chart183.forEach(row => {
                row.plan_id = plan.id;
                row.origin = '1.8.3';
            });

            const chartsOneEight = chart181.concat(chart182, chart183);
            for (let i = 0; i < chartsOneEight.length; i++) {
                try {
                    await new PlanChartOneEightRow(chartsOneEight[i]).save();
                } catch (e) {
                    Log.error(e);
                }
            }
        }

        const chartFourData = mavatData.chartFour;
        if (chartFourData !== undefined) {

            addPlanIdToArray(chartFourData);

            for (let i = 0; i < chartFourData.length; i++) {
                try {
                    await new PlanChartFourRow(chartFourData[i]).save();
                } catch (e) {
                    Log.error(e);
                }
            }
        }

        const chartFiveData = mavatData.chartFive;
        if (chartFiveData !== undefined) {

            addPlanIdToArray(chartFiveData);

            for (let i = 0; i < chartFiveData.length; i++) {
                try {
                    await new PlanChartFiveRow(chartFiveData[i]).save();
                } catch (e) {
                    Log.error(e);
                }
            }
        }

        const chartSixData = mavatData.chartSix;
        if (chartSixData !== undefined) {

            addPlanIdToArray(chartSixData);

            for (let i = 0; i < chartSixData.length; i++) {
                try {
                    await new PlanChartSixRow(chartSixData[i]).save();
                } catch (e) {
                    Log.error(e);
                }
            }
        }
    }

    static getUnsentPlans(userOptions) {
        const options = userOptions || {};
        if (!options.limit) {
            options.limit = 1;
        }
        return Plan.query(qb => {
            qb.where("sent", "=", "0");
            if (options.OBJECTID) {
                qb.where("OBJECTID", "=", options.OBJECTID);
            }
        }).fetchPage({
            pageSize: options.limit,
            columns: [
                "id",
                "data",
                "goals_from_mavat",
                "main_details_from_mavat",
                "geom",
                "jurisdiction"
            ]
        });
    }
}
module.exports = Plan;

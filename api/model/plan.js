const Bluebird = require("bluebird");
const Model = require("./base_model");
const Log = require("../lib/log");
const Exception = require("./exception");
const DetailsClassifier = require("../../data_processing/categorize_plans");
const PlanDetail = require("./plan_detail");
const PlanChartFiveRow = require('./plan_chart_five_row');
const PlanChart18Row = require('./plan_chart_1_point_8_row');
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

    static async setMavatData(plan, mavatData) {
        const addPlanIdToChart = (chart) => {
            chart.forEach(row => row.plan_id = plan.id);
        };

        const prevDetails = plan.main_details_from_mavat;

        await plan.set({
            goals_from_mavat: mavatData.goals,
            main_details_from_mavat: mavatData.mainPlanDetails,
            jurisdiction: mavatData.jurisdiction,
            areaChanges: mavatData.areaChanges,
            explanation: mavatData.planExplanation
        });
        await plan.save();

        if (mavatData.charts18 !== undefined) {
            const chart181 = mavatData.charts18.chart181;
            //add plain_id and origin
            chart181.forEach(row => {
                row.plan_id = plan.id;
                row.origin = '1.8.1';
            });

            const chart182 = mavatData.charts18.chart182;
            chart182.forEach(row => {
                row.plan_id = plan.id;
                row.origin = '1.8.2';
            });

            const chart183 = mavatData.charts18.chart183;
            chart183.forEach(row => {
                row.plan_id = plan.id;
                row.origin = '1.8.3';
            });

            const charts18 = chart181.concat(chart182, chart183);
            for (let i = 0; i < charts18.length; i++) {
                try {
                    await new PlanChart18Row(charts18[i]).save();
                } catch (e) {
                    console.log(e);
                }
            }
        }

        const chartFourData = mavatData.chartFour;
        if (chartFourData !== undefined) {

            addPlanIdToChart(chartFourData);

            for (let i = 0; i < chartFourData.length; i++) {
                const chartFourRowData = chartFourData[i];
                try {
                    await new PlanChartFourRow(chartFourRowData).save();
                } catch (e) {
                    console.log(e);
                }
            }
        }

        const chartFiveData = mavatData.chartFive;
        if (chartFiveData !== undefined) {

            addPlanIdToChart(chartFiveData);

            for (let i = 0; i < chartFiveData.length; i++) {
                const chartFiveRowData = chartFiveData[i];
                try {
                    await new PlanChartFiveRow(chartFiveRowData).save();
                } catch (e) {
                    console.log(e);
                }
            }
        }

        const chartSixData = mavatData.chartSix;
        if (chartSixData !== undefined) {

            addPlanIdToChart(chartSixData);

            for (let i = 0; i < chartSixData.length; i++) {
                const chartSixRowData = chartSixData[i];
                try {
                    await new PlanChartSixRow(chartSixRowData).save();
                } catch (e) {
                    console.log(e);
                }
            }
        }


        if (prevDetails === mavatData.mainPlanDetails || mavatData.mainPlanDetails === undefined) {
            return;
        }

        const stopWords = await DetailsClassifier.readStopWords();
        const details = DetailsClassifier.parseStrDetailsOfPlan(mavatData.mainPlanDetails, stopWords);

        for (const detail of details) {
            if (detail !== undefined) {
                const detailData = {
                    planId: plan.id,
                    tag: detail.tag,
                    detail: detail.detail,
                    area_designation_from: detail.hasOwnProperty('fromArea') ? detail.fromArea : '',
                    area_designation_to: detail.hasOwnProperty('toArea') ? detail.toArea : ''
                };

                await new PlanDetail(detailData).save();
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

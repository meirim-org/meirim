const Bluebird = require("bluebird");
const Model = require("./base_model");
const Log = require("../lib/log");
const Exception = require("./exception");

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
            areaChanges: "string"
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

    static maekPlansAsSent(plan_ids) {
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

    static setMavatData(plan, mavatData) {
        return plan.set({
            plan_url: mavatData.plan_url,
            goals_from_mavat: mavatData.goals,
            main_details_from_mavat: mavatData.mainPlanDetails,
            jurisdiction: mavatData.jurisdiction,
            areaChanges: mavatData.areaChanges
        });
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

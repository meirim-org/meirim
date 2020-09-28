const Model = require("./base_model");


class PlanTag extends Model {
    get rules() {
        return {
            plan_id: ["required", "integer"],
            tag: "string",
            origin: "string",      // for example: chart 5
        };
    }

    get tableName() {
        return 'plan_tags';
    }
}

module.exports = PlanTag;

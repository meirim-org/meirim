const Model = require("./base_model");


class PlanChartSixRow extends Model {
    get rules() {
        return {
            plan_id: ["required", "integer"],
            category_number: "string",
            category: "string",
            text: "string"
        };
    }

    get tableName() {
        return 'table_6_additional_instructions';
    }
}

module.exports = PlanChartSixRow;

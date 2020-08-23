const Model = require("./base_model");


class PlanChartFourRow extends Model {
    get rules() {
        return {
            plan_id: ["required", "integer"],
            category_number: "string",
            category: "string",
            father_category_number: "string",
            father_category: "string",
            text: "string"
        };
    }

    get tableName() {
        return 'table_4_area_designation_and_usage';
    }
}

module.exports = PlanChartFourRow;

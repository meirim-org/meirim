const Model = require('./base_model');

class PlanChartSixRow extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			category_number: 'string', // for example: 6.1 or 6.3
			category: 'string', // name of the category
			text: 'string'
		};
	}

	get tableName () {
		return 'table_6_additional_instructions';
	}
}

module.exports = PlanChartSixRow;

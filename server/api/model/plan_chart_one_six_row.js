const Model = require('./base_model');

class PlanChart16Row extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			prev_plan_number: 'string',
			kind: 'string',
			comment: 'string',
			yalkoot_number: 'string',
			yalkoot_page_number: 'string',
			date: 'string',
		};
	}

	get tableName () {
		return 'table_1_6_prev_plans_relations';
	}
}

module.exports = PlanChart16Row;

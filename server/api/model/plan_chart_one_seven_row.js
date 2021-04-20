const Model = require('./base_model');

class PlanChart17Row extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			kind: 'string',
			contains: 'string',
			scale: 'string',
			number_of_pages: 'string',
			edit_date: 'string',
			editor: 'string',
			creation_date: 'string',
			description: 'string',
			included: 'string',
		};
	}

	get tableName () {
		return 'table_1_7_plan_docs';
	}
}

module.exports = PlanChart17Row;

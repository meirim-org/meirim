const Model = require('./base_model');

class PlanChart32Row extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			designation: 'string',
			contains: 'string',
			size_in_mr: 'string',
			percentage: 'string',
			is_current_state: 'boolean'
		};
	}

	get tableName () {
		return 'table_3_2_areas_table';
	}
}

module.exports = PlanChart32Row;

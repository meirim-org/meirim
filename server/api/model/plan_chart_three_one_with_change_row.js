const Model = require('./base_model');

class PlanChart31WithChangeAreaRow extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			designation: 'string',
			tasrit_marking: 'string',
			field_cells: 'string',
		};
	}

	get tableName () {
		return 'table_3_1_with_change';
	}
}

module.exports = PlanChart31WithChangeAreaRow;

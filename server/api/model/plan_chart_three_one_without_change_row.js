const Model = require('./base_model');

class PlanChart31WithoutChangeAreaRow extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			designation: 'string',
			field_cells: 'string',
		};
	}

	get tableName () {
		return 'table_3_1_without_change';
	}
}

module.exports = PlanChart31WithoutChangeAreaRow;

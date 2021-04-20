const Model = require('./base_model');

class PlanChart71Row extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			phase: 'string',
			phase_description: 'string',
			conditioning: 'string',
		};
	}

	get tableName () {
		return 'table_7_1_implementation_stages';
	}
}

module.exports = PlanChart71Row;

const Model = require('./base_model');

class PlanStatusChange extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			status: 'string', // enum code
			date: 'date', // status date, as shown in mavat
			status_description: 'string', // text as shown in mavat
			last_updated: 'date' // when did we catch the update
		};
	}

	get tableName () {
		return 'plan_status_change';
	}
}

module.exports = PlanStatusChange;

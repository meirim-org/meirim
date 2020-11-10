const Model = require('./base_model');

class PlanStatus extends Model {
	get rules() {
		return {
			plan_id: ['required', 'integer'],
			status: ['required', 'string'],  // TODO: after testing should change to some encoding scheme
			date: ['required', function(val) {
				// validation function since checkit 'date' does not work
				if (!val || Object.prototype.toString.call(val) !== "[object Date]" || isNaN(val))
					throw new Error('date field is invalid');
			}]
		};
	}

	get tableName() {
		return 'plan_status';
	}
}

module.exports = PlanStatus;

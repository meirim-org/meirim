const Model = require('./base_model');

class PlanChart18Row extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			origin: 'string', // the origin of the row - 1.8.1 or 1.8.2 or 1.8.3
			profession: 'string',
			type: 'string',
			description: 'string',
			name: 'string',
			license_number: 'string',
			corporate: 'string',
			city: 'string',
			street: 'string',
			house: 'string',
			phone: 'string',
			fax: 'string',
			email: 'string'
		};
	}

	get tableName () {
		return 'tables_18_interests_in_plan';
	}
}

module.exports = PlanChart18Row;

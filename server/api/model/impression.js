const Model = require('./base_model');
const Plan = require('./plan');

class Impression extends Model {
	get rules () {
		return {
			plan_id: ['required', 'integer'],
			ip: ['required', 'integer']
		};
	}

	get tableName () {
		return 'impression';
	}

	plan () {
		return this.belongsTo(Plan);
	}
}
module.exports = Impression;
